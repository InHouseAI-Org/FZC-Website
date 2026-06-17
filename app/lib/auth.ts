// Admin authentication utilities with database support
import { cookies, headers } from 'next/headers';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

export const SESSION_COOKIE_NAME = 'admin_session';
const SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds

// ============================================
// Password Hashing
// ============================================

/**
 * Hash a plain text password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

/**
 * Compare a plain text password with a hashed password
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

// ============================================
// Session Management
// ============================================

/**
 * Generate a secure random session token
 */
export function generateSessionToken(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(32));
  return Array.from(randomBytes, byte => byte.toString(16).padStart(2, '0')).join('');
}

/**
 * Get client IP address
 */
function getClientIp(): string | undefined {
  const headersList = headers();
  return (
    headersList.get('x-forwarded-for')?.split(',')[0] ||
    headersList.get('x-real-ip') ||
    undefined
  );
}

/**
 * Get user agent string
 */
function getUserAgent(): string | undefined {
  const headersList = headers();
  return headersList.get('user-agent') || undefined;
}

// ============================================
// Authentication
// ============================================

/**
 * Verify admin credentials against database
 */
export async function verifyCredentials(username: string, password: string): Promise<boolean> {
  try {
    // Find admin user by username
    const user = await prisma.adminUser.findFirst({
      where: {
        username,
        isActive: true,
      },
    });

    if (!user) {
      return false;
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password);

    // Update last login time if password is correct
    if (isValid) {
      await prisma.adminUser.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
      });
    }

    return isValid;
  } catch (error) {
    console.error('Error verifying credentials:', error);
    return false;
  }
}

/**
 * Create a new session in database and set cookie
 */
export async function createSession(username: string): Promise<string> {
  try {
    // Find the user
    const user = await prisma.adminUser.findUnique({
      where: { username },
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Generate session token
    const token = generateSessionToken();
    const expiresAt = new Date(Date.now() + SESSION_DURATION);
    const ipAddress = getClientIp();
    const userAgent = getUserAgent();

    // Create session in database
    await prisma.session.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
        ipAddress,
        userAgent,
      },
    });

    // Set cookie
    (await cookies()).set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_DURATION / 1000, // in seconds
      path: '/',
    });

    return token;
  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

/**
 * Get current session token from cookie
 */
export async function getSessionToken(): Promise<string | undefined> {
  return (await cookies()).get(SESSION_COOKIE_NAME)?.value;
}

/**
 * Get current session from database
 */
export async function getSession() {
  try {
    const token = await getSessionToken();
    if (!token) {
      return null;
    }

    // Find session in database
    const session = await prisma.session.findUnique({
      where: { token },
      include: { user: true },
    });

    // Check if session exists and is not expired
    if (!session || session.expiresAt < new Date()) {
      // Delete expired session if it exists
      if (session) {
        await prisma.session.delete({
          where: { id: session.id },
        });
      }
      return null;
    }

    return session;
  } catch (error) {
    console.error('Error getting session:', error);
    return null;
  }
}

/**
 * Get current user from session
 */
export async function getCurrentUser() {
  const session = await getSession();
  return session?.user || null;
}

/**
 * Delete session from database and remove cookie
 */
export async function deleteSession(): Promise<void> {
  try {
    const token = await getSessionToken();

    if (token) {
      // Delete session from database
      await prisma.session.deleteMany({
        where: { token },
      });
    }

    // Remove cookie
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
  } catch (error) {
    console.error('Error deleting session:', error);
  }
}

/**
 * Check if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getSession();
  return !!session;
}

/**
 * Clean up expired sessions (should be run periodically via cron)
 */
export async function cleanupExpiredSessions(): Promise<number> {
  try {
    const result = await prisma.session.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
      },
    });
    return result.count;
  } catch (error) {
    console.error('Error cleaning up sessions:', error);
    return 0;
  }
}

// ============================================
// Admin User Management
// ============================================

/**
 * Create a new admin user
 */
export async function createAdminUser(data: {
  username: string;
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
  role?: string;
}) {
  try {
    // Hash password
    const hashedPassword = await hashPassword(data.password);

    // Create user
    const user = await prisma.adminUser.create({
      data: {
        username: data.username,
        email: data.email,
        password: hashedPassword,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role || 'admin',
      },
    });

    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  } catch (error) {
    console.error('Error creating admin user:', error);
    throw error;
  }
}

/**
 * Update admin user password
 */
export async function updatePassword(username: string, newPassword: string): Promise<boolean> {
  try {
    const hashedPassword = await hashPassword(newPassword);

    await prisma.adminUser.update({
      where: { username },
      data: { password: hashedPassword },
    });

    return true;
  } catch (error) {
    console.error('Error updating password:', error);
    return false;
  }
}
