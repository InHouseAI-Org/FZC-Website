import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';
import 'isomorphic-fetch';

/**
 * Creates and returns an authenticated Microsoft Graph client
 */
function getGraphClient() {
  const credential = new ClientSecretCredential(
    process.env.AZURE_TENANT_ID,
    process.env.AZURE_CLIENT_ID,
    process.env.AZURE_CLIENT_SECRET
  );

  const client = Client.initWithMiddleware({
    authProvider: {
      getAccessToken: async () => {
        const token = await credential.getToken('https://graph.microsoft.com/.default');
        return token.token;
      },
    },
  });

  return client;
}

/**
 * Sends a confirmation email to the customer
 * @param {Object} formData - The contact form data
 * @returns {Promise<void>}
 */
async function sendCustomerConfirmation(client, formData) {
  const { name, email, enquiryType } = formData;

  const enquiryTypeLabels = {
    sales: 'Sales Enquiry',
    technical: 'Technical Support',
    general: 'General Information',
    partnership: 'Partnership Opportunities'
  };

  const customerEmailBody = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a1918; padding: 30px; text-align: center;">
          <img src="https://inmarco.ae/logo.png" alt="Inmarco FZC Logo" style="max-width: 200px; height: auto; margin-bottom: 10px;" />
          <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 14px;">Precision Sealing Solutions</p>
        </div>

        <div style="padding: 40px 30px; background-color: #ffffff;">
          <h2 style="color: #1a1918; margin-top: 0; font-size: 24px;">Thank You for Contacting Us!</h2>

          <p style="color: #333; font-size: 16px; line-height: 1.8;">
            Dear ${name},
          </p>

          <p style="color: #333; font-size: 16px; line-height: 1.8;">
            We have received your enquiry and appreciate you reaching out to Inmarco FZC.
          </p>

          <div style="background-color: #f5f5f5; border-left: 4px solid #e31e24; padding: 20px; margin: 30px 0; border-radius: 4px;">
            <p style="color: #333; font-size: 16px; line-height: 1.8; margin: 0;">
              <strong>What happens next?</strong><br>
              Our team of sealing experts will review your enquiry and get back to you shortly. We're committed to providing you with the best solution for your specific requirements.
            </p>
          </div>

          <p style="color: #333; font-size: 16px; line-height: 1.8;">
            If you have any urgent questions, feel free to contact us directly:
          </p>

          <div style="margin: 20px 0;">
            <p style="color: #666; font-size: 14px; margin: 8px 0;">
              <strong>Phone:</strong> <a href="tel:+971559487218" style="color: #e31e24; text-decoration: none;">+971 55 948 7218</a>
            </p>
            <p style="color: #666; font-size: 14px; margin: 8px 0;">
              <strong>Address:</strong> P.O. Box 120284, SAIF-Zone, Sharjah, UAE
            </p>
          </div>

          <p style="color: #333; font-size: 16px; line-height: 1.8; margin-top: 30px;">
            Best regards,<br>
            <strong style="color: #e31e24;">Inmarco FZC Team</strong>
          </p>
        </div>

        <div style="background-color: #1a1918; padding: 20px 30px; text-align: center;">
          <p style="color: #999; font-size: 12px; margin: 5px 0;">
            © ${new Date().getFullYear()} Inmarco FZC. All rights reserved.
          </p>
          <p style="color: #999; font-size: 12px; margin: 5px 0;">
            Working Hours: Monday - Saturday, 8:30 AM - 5:30 PM GST
          </p>
        </div>
      </body>
    </html>
  `;

  const customerMail = {
    message: {
      subject: 'Thank you for contacting Inmarco FZC - We\'ll be in touch soon!',
      body: {
        contentType: 'HTML',
        content: customerEmailBody,
      },
      toRecipients: [
        {
          emailAddress: {
            address: email,
            name: name,
          },
        },
      ],
    },
    saveToSentItems: true,
  };

  await client
    .api(`/users/${process.env.AZURE_EMAIL_FROM}/sendMail`)
    .post(customerMail);
}

/**
 * Sends an email using Microsoft Graph API
 * @param {Object} formData - The contact form data
 * @returns {Promise<Object>} - Result of the email operation
 */
export async function sendContactEmail(formData) {
  try {
    const client = getGraphClient();

    const { name, email, phone, company, enquiryType, message } = formData;

    // Determine the recipient email based on enquiry type
    const recipientEmail = enquiryType === 'sales'
      ? 'sales@inmarco.ae'
      : 'techsupport@inmarco.ae';

    // Format the internal notification email body
    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
          <h2 style="color: #e31e24; border-bottom: 2px solid #e31e24; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>

          <div style="margin: 20px 0;">
            <h3 style="color: #1a1918; margin-bottom: 15px;">Contact Details</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold; width: 150px;">Name:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Email:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                  <a href="mailto:${email}" style="color: #e31e24; text-decoration: none;">${email}</a>
                </td>
              </tr>
              ${phone ? `
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Phone:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${phone}</td>
                </tr>
              ` : ''}
              ${company ? `
                <tr>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Company:</td>
                  <td style="padding: 8px; border-bottom: 1px solid #ddd;">${company}</td>
                </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px; border-bottom: 1px solid #ddd; font-weight: bold;">Enquiry Type:</td>
                <td style="padding: 8px; border-bottom: 1px solid #ddd;">
                  <span style="background-color: #e31e24; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px;">
                    ${enquiryType.charAt(0).toUpperCase() + enquiryType.slice(1)}
                  </span>
                </td>
              </tr>
            </table>
          </div>

          <div style="margin: 20px 0;">
            <h3 style="color: #1a1918; margin-bottom: 15px;">Message</h3>
            <div style="background-color: #f5f5f5; padding: 15px; border-left: 4px solid #e31e24; border-radius: 4px;">
              ${message.replace(/\n/g, '<br>')}
            </div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>This email was sent from the FZC Inmarco website contact form.</p>
            <p>Sent on: ${new Date().toLocaleString('en-US', { timeZone: 'Asia/Dubai' })} GST</p>
          </div>
        </body>
      </html>
    `;

    const mail = {
      message: {
        subject: `New Contact Form: ${enquiryType.charAt(0).toUpperCase() + enquiryType.slice(1)} - ${name}`,
        body: {
          contentType: 'HTML',
          content: emailBody,
        },
        toRecipients: [
          {
            emailAddress: {
              address: recipientEmail,
            },
          },
        ],
        replyTo: [
          {
            emailAddress: {
              address: email,
              name: name,
            },
          },
        ],
      },
      saveToSentItems: true,
    };

    // Send the internal notification email
    await client
      .api(`/users/${process.env.AZURE_EMAIL_FROM}/sendMail`)
      .post(mail);

    // Send the customer confirmation email
    await sendCustomerConfirmation(client, formData);

    return {
      success: true,
      message: 'Emails sent successfully',
    };
  } catch (error) {
    console.error('Error sending email:', error);
    throw {
      success: false,
      message: 'Failed to send email',
      error: error.message,
    };
  }
}
