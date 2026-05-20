# Database Setup Guide

This guide will help you set up the PostgreSQL database with Prisma for admin authentication and analytics tracking.

---

## Prerequisites

- Docker Desktop installed and running
- Node.js and npm installed
- Git repository cloned

---

## Quick Setup (Local Development)

### 1. Start PostgreSQL Container

```bash
# Start PostgreSQL using Docker Compose
docker-compose -f docker-compose.dev.yml up -d

# Verify it's running
docker ps
```

You should see `inmarco-postgres-dev` container running.

### 2. Run Database Migrations

```bash
# Generate Prisma Client
npx prisma generate

# Create and run migrations
npx prisma migrate dev --name init

# This will create all tables in the database
```

### 3. Set Admin Password (REQUIRED)

Before seeding, set your admin password in `.env`:

```bash
# Edit .env file and set:
ADMIN_PASSWORD="YourSecurePasswordHere123!"
```

### 4. Seed Initial Admin User

```bash
# Run the seed script to create initial admin
npx prisma db seed
```

**Two Options:**

**Option A: Set Password in .env (Recommended)**
```bash
# .env file
ADMIN_PASSWORD="YourSecurePasswordHere123!"

# Then run seed
npx prisma db seed
```

Output:
```
✓ Created admin user: { username: 'Inmarco', email: 'admin@inmarco.ae' }
✓ Using password from ADMIN_PASSWORD environment variable
```

**Option B: Auto-Generate Random Password**

If you don't set `ADMIN_PASSWORD`, a secure random password will be generated:

```bash
# Run without ADMIN_PASSWORD set
npx prisma db seed
```

Output:
```
═════════════════════════════════════════════════════════
📝 IMPORTANT: Save these credentials immediately!
═════════════════════════════════════════════════════════
   Username: Inmarco
   Password: aB3!xK9@mP2#vN5%
═════════════════════════════════════════════════════════
⚠️  This password will NOT be shown again!
⚠️  Set ADMIN_PASSWORD in .env for consistent password.
```

**⚠️ SECURITY**: No passwords are hardcoded in the codebase!

### 5. Verify Setup

```bash
# Open Prisma Studio to view database
npx prisma studio
```

This opens a browser at `http://localhost:5555` where you can view all database tables.

---

## Production Deployment

### Environment Variables

Create `.env.production` file:

```bash
# Database
DATABASE_URL="postgresql://inmarco:YOUR_SECURE_PASSWORD@postgres:5432/inmarco_website?schema=public"
POSTGRES_PASSWORD=YOUR_SECURE_PASSWORD

# Admin Auth
JWT_SECRET="generate-a-secure-random-string-here"

# Email (Microsoft Graph)
AZURE_TENANT_ID=your-tenant-id
AZURE_CLIENT_ID=your-client-id
AZURE_CLIENT_SECRET=your-client-secret
AZURE_EMAIL_FROM=noreply@inmarco.ae

# Analytics
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
```

### Deploy with Docker

```bash
# Build and start all services (includes PostgreSQL)
docker-compose build
docker-compose up -d

# Run migrations inside the container
docker-compose exec nextjs npx prisma migrate deploy

# Seed the database
docker-compose exec nextjs npx prisma db seed
```

---

## Database Schema Overview

### Authentication Tables
- **admin_users**: Admin user accounts with hashed passwords
- **sessions**: Active admin sessions with expiry tracking

### Analytics Tables
- **page_views**: Every page view with device/location data
- **product_views**: Product-specific view tracking
- **industry_views**: Industry page view tracking
- **analytics_events**: Generic event tracking
- **contact_submissions**: Form submissions with status tracking
- **download_events**: File download tracking
- **visitors**: Visitor profiles and traffic sources
- **visitor_sessions**: Session duration and engagement metrics

---

## Common Commands

### Database Management

```bash
# Generate Prisma Client after schema changes
npx prisma generate

# Create a new migration
npx prisma migrate dev --name your_migration_name

# Deploy migrations (production)
npx prisma migrate deploy

# Reset database (⚠️ destroys all data!)
npx prisma migrate reset

# View database in browser
npx prisma studio
```

### Seed Database

```bash
# Seed initial data
npx prisma db seed

# Or run the seed file directly
npx tsx prisma/seed.ts
```

### Check Database Connection

```bash
# Test database connection
npx prisma db pull
```

---

## Troubleshooting

### Cannot connect to database

**Error:** `P1001: Can't reach database server`

**Solution:**
```bash
# Check if PostgreSQL container is running
docker ps

# Restart the database container
docker-compose -f docker-compose.dev.yml restart

# Check logs
docker logs inmarco-postgres-dev
```

### Migration fails

**Error:** `P3009: Failed to create database`

**Solution:**
```bash
# Drop the database and recreate
docker-compose -f docker-compose.dev.yml down -v
docker-compose -f docker-compose.dev.yml up -d

# Wait 10 seconds for database to initialize
sleep 10

# Run migrations again
npx prisma migrate dev
```

### Prisma Client out of sync

**Error:** `Prisma Client is not up to date`

**Solution:**
```bash
# Regenerate Prisma Client
npx prisma generate
```

### Permission denied errors

**Solution:**
```bash
# Fix ownership of Prisma files
sudo chown -R $USER:$USER prisma/
sudo chown -R $USER:$USER node_modules/@prisma/
```

---

## Managing Admin Users

### Create Additional Admin Users

You can create admin users programmatically:

```typescript
import { createAdminUser } from './app/lib/auth';

await createAdminUser({
  username: 'newadmin',
  email: 'newadmin@inmarco.ae',
  password: 'SecurePassword123',
  firstName: 'New',
  lastName: 'Admin',
  role: 'admin',
});
```

### Change Admin Password

```typescript
import { updatePassword } from './app/lib/auth';

await updatePassword('Inmarco', 'NewSecurePassword');
```

### View Admin Users in Database

```bash
# Open Prisma Studio
npx prisma studio

# Navigate to admin_users table
```

---

## Analytics Data Collection

Analytics data is automatically collected when users:
- Visit pages (`trackPageView`)
- View products (`trackProductView`)
- View industries (`trackIndustryView`)
- Submit contact forms (`trackContactSubmission`)
- Download files (`trackDownload`)

The admin dashboard automatically fetches real data from the database.

---

## Backup and Restore

### Backup Database

```bash
# Create backup directory
mkdir -p backups

# Backup using Docker
docker exec inmarco-postgres pg_dump -U inmarco inmarco_website > backups/backup_$(date +%Y%m%d_%H%M%S).sql
```

### Restore Database

```bash
# Restore from backup file
cat backups/backup_20260520_120000.sql | docker exec -i inmarco-postgres psql -U inmarco -d inmarco_website
```

---

## Security Best Practices

1. **Change Default Passwords**: Update the admin password immediately after first login
2. **Use Strong Database Password**: Generate a secure random password for production
3. **Secure Environment Variables**: Never commit `.env` files to git
4. **Enable SSL**: Use SSL connections for production database
5. **Regular Backups**: Schedule automated backups of your database
6. **Session Cleanup**: Run `cleanupExpiredSessions()` periodically via cron

---

## Database Maintenance

### Clean Up Expired Sessions

```typescript
import { cleanupExpiredSessions } from './app/lib/auth';

// Run this periodically (e.g., daily via cron)
const deletedCount = await cleanupExpiredSessions();
console.log(`Deleted ${deletedCount} expired sessions`);
```

### Monitor Database Size

```bash
# Check database size
docker exec inmarco-postgres psql -U inmarco -d inmarco_website -c "SELECT pg_size_pretty(pg_database_size('inmarco_website'));"
```

---

## Next Steps

1. ✅ Set up database
2. ✅ Run migrations
3. ✅ Seed initial admin user
4. 🔄 Start Next.js application (`npm run dev`)
5. 🔄 Login to admin dashboard at `/admin`
6. 🔄 Monitor analytics at `/admin/analytics`

---

**Need Help?**
- Check Prisma docs: https://pris.ly/d/prisma-schema
- Review error logs: `docker logs inmarco-postgres-dev`
- Open Prisma Studio: `npx prisma studio`
