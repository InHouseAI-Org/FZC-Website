// Database seed script - Creates initial admin user
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

const prisma = new PrismaClient();

/**
 * Generate a secure random password
 */
function generateSecurePassword(): string {
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  const randomBytes = crypto.randomBytes(length);

  for (let i = 0; i < length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }

  return password;
}

async function main() {
  console.log('🌱 Seeding database...');

  // Get admin credentials from environment variables
  const adminUsername = process.env.ADMIN_USERNAME || 'Inmarco';
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@inmarco.ae';

  // Use environment variable password, or generate a secure random one
  let plainPassword = process.env.ADMIN_PASSWORD;
  let passwordGenerated = false;

  if (!plainPassword) {
    plainPassword = generateSecurePassword();
    passwordGenerated = true;
    console.warn('⚠️  No ADMIN_PASSWORD environment variable set!');
    console.warn('⚠️  Generated secure random password for admin user.');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  // Create initial admin user
  const admin = await prisma.adminUser.upsert({
    where: { username: adminUsername },
    update: {},
    create: {
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      firstName: 'Admin',
      lastName: 'User',
      role: 'superadmin',
      isActive: true,
    },
  });

  console.log('✓ Created admin user:', { username: admin.username, email: admin.email });

  if (passwordGenerated) {
    console.log('');
    console.log('═════════════════════════════════════════════════════════');
    console.log('📝 IMPORTANT: Save these credentials immediately!');
    console.log('═════════════════════════════════════════════════════════');
    console.log(`   Username: ${adminUsername}`);
    console.log(`   Password: ${plainPassword}`);
    console.log('═════════════════════════════════════════════════════════');
    console.log('⚠️  This password will NOT be shown again!');
    console.log('⚠️  Set ADMIN_PASSWORD in .env for consistent password.');
    console.log('');
  } else {
    console.log('✓ Using password from ADMIN_PASSWORD environment variable');
  }

  // You can add more seed data here (sample analytics, etc.)

  console.log('✨ Seeding completed successfully!');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding database:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
