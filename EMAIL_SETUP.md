# Contact Form Email Setup

This document explains how the contact form email functionality is configured and how to use it.

## Overview

The contact form sends emails using **Microsoft Graph API** with Azure Active Directory authentication. When a user submits the contact form, an email is sent to `manav.bathija@inhouseai.org` with all the form details.

## Architecture

- **Frontend**: React form component (`src/app/pages/Contact.tsx`)
- **Backend**: Express API server (`server/index.js`)
- **Email Service**: Microsoft Graph API integration (`server/emailService.js`)

## Configuration

### Environment Variables

The following environment variables are configured in `.env.local`:

```env
AZURE_TENANT_ID=2bb56598-4af1-432d-bb35-d243c32e6d44
AZURE_CLIENT_ID=3ddfd0fb-9584-477f-9f11-6573e7b97de1
AZURE_CLIENT_SECRET=uxh8Q~vsE0DkCzgdc8vFyxX_JnT458wPgncSddaI
AZURE_EMAIL_FROM=manav.bathija@inhouseai.org
AZURE_EMAIL_TO=manav.bathija@inhouseai.org
```

**Important**: Never commit `.env.local` to version control as it contains sensitive credentials.

## Running the Application

### Option 1: Run Both Frontend and Backend Together

```bash
npm run dev:all
```

This starts:
- Frontend (Vite): http://localhost:4001
- Backend API: http://localhost:3001

### Option 2: Run Separately

**Terminal 1 - Backend API:**
```bash
npm run server
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

## API Endpoints

### POST /api/contact

Sends a contact form email.

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+971 55 123 4567",
  "company": "ABC Company",
  "enquiryType": "sales",
  "message": "I would like to inquire about your products."
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error message here"
}
```

### GET /api/health

Health check endpoint to verify the API server is running.

**Response:**
```json
{
  "status": "ok",
  "message": "API server is running"
}
```

## Email Template

The email sent to `manav.bathija@inhouseai.org` includes:

- **Subject**: `New Contact Form: [Enquiry Type] - [Name]`
- **From**: The configured Azure email account
- **Reply-To**: The submitter's email address
- **Content**:
  - Contact details (name, email, phone, company)
  - Enquiry type (highlighted badge)
  - Message content
  - Timestamp (GST timezone)

## Form Fields

### Required Fields:
- Name
- Email
- Enquiry Type
- Message

### Optional Fields:
- Phone
- Company

### Enquiry Types:
- Sales Enquiry
- Technical Support
- General Information
- Partnership Opportunities

## Features

1. **Email Validation**: The form validates email format before submission
2. **Loading State**: Shows "Sending..." while submitting
3. **Success/Error Messages**: Displays feedback after submission
4. **Form Reset**: Clears form on successful submission
5. **Disabled State**: Prevents multiple submissions
6. **Professional Email Template**: HTML-formatted with company branding
7. **Reply-To Header**: Allows direct replies to the submitter

## Troubleshooting

### Email Not Sending

1. **Check API Server**: Ensure the server is running on port 3001
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **Verify Environment Variables**: Make sure all Azure credentials are correct in `.env.local`

3. **Check Console Logs**: Look for error messages in the server terminal

4. **Azure Permissions**: Ensure the Azure App has `Mail.Send` permission

### CORS Errors

If you see CORS errors in the browser console:
- Verify the backend server is running
- Check that CORS is enabled in `server/index.js`

### Connection Refused

If the frontend can't connect to the API:
- Ensure the backend is running on port 3001
- Check firewall settings
- Verify the API URL in `Contact.tsx` matches your server port

## Security Considerations

1. **Never expose credentials**: Keep `.env.local` out of version control
2. **HTTPS in Production**: Use HTTPS for both frontend and API in production
3. **Rate Limiting**: Consider adding rate limiting to prevent abuse
4. **Input Validation**: Server validates all inputs before processing
5. **Email Validation**: Basic regex validation prevents invalid emails

## Production Deployment

For production deployment:

1. **Update API URL**: Change the hardcoded `http://localhost:3001` in `Contact.tsx` to your production API URL
2. **Use Environment Variable**: Consider using `import.meta.env.VITE_API_URL`
3. **Secure Credentials**: Use secure secret management (Azure Key Vault, etc.)
4. **Enable HTTPS**: Configure SSL/TLS for both frontend and API
5. **Add Rate Limiting**: Implement rate limiting to prevent spam
6. **Error Monitoring**: Set up error tracking (Sentry, etc.)

## Dependencies

- `@azure/identity`: Azure authentication
- `@microsoft/microsoft-graph-client`: Microsoft Graph API client
- `express`: Backend API server
- `cors`: Cross-origin resource sharing
- `dotenv`: Environment variable management
- `isomorphic-fetch`: Fetch API polyfill for Node.js
