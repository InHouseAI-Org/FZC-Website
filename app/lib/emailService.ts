// Email service using Microsoft Graph API
// Next.js compatible version
import { Client } from '@microsoft/microsoft-graph-client';
import { ClientSecretCredential } from '@azure/identity';
import fs from 'fs';
import path from 'path';

/**
 * Gets the logo as base64 data URL for embedding in emails
 */
function getLogoBase64(): string {
  try {
    const logoPath = path.join(process.cwd(), 'public', 'inmarco-tagline-logo1.webp');
    const logoBuffer = fs.readFileSync(logoPath);
    const logoBase64 = logoBuffer.toString('base64');
    return `data:image/webp;base64,${logoBase64}`;
  } catch (error) {
    console.error('Error reading logo file:', error);
    // Fallback to external URL if file read fails
    return 'https://inmarco.ae/inmarco-tagline-logo1.webp';
  }
}

/**
 * Creates and returns an authenticated Microsoft Graph client
 */
function getGraphClient() {
  const credential = new ClientSecretCredential(
    process.env.AZURE_TENANT_ID!,
    process.env.AZURE_CLIENT_ID!,
    process.env.AZURE_CLIENT_SECRET!
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
 */
async function sendCustomerConfirmation(client: any, formData: {
  name: string;
  email: string;
  enquiryType: string;
}) {
  const { name, email, enquiryType } = formData;

  const enquiryTypeLabels: Record<string, string> = {
    sales: 'Sales Enquiry',
    technical: 'Technical Support',
    general: 'General Information',
    partnership: 'Partnership Opportunities'
  };

  // Get logo as base64 for email embedding
  const logoSrc = getLogoBase64();

  const customerEmailBody = `
    <html>
      <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
        <div style="background-color: #1a1918; padding: 30px; text-align: center;">
          <img src="${logoSrc}" alt="Inmarco FZC Logo" style="max-width: 200px; height: auto; margin-bottom: 10px;" />
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
 * Sends a contact form email using Microsoft Graph API
 */
export async function sendContactEmail(formData: {
  name: string;
  email: string;
  phone?: string;
  company?: string;
  enquiryType: string;
  message: string;
}) {
  try {
    // Validate required environment variables
    if (!process.env.AZURE_TENANT_ID || !process.env.AZURE_CLIENT_ID || !process.env.AZURE_CLIENT_SECRET) {
      throw new Error('Azure credentials not configured. Please set AZURE_TENANT_ID, AZURE_CLIENT_ID, and AZURE_CLIENT_SECRET.');
    }

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
            <p>This email was sent from the Inmarco website contact form.</p>
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
  } catch (error: any) {
    console.error('Error sending email:', error);
    throw new Error(`Failed to send email: ${error.message}`);
  }
}

/**
 * Sends a datasheet email to the recipient with PDF attachment
 */
export async function sendDatasheetEmail(formData: {
  recipientEmail: string;
  senderEmail?: string;
  productName: string;
  productSlug: string;
  datasheetUrl: string;
}) {
  try {
    // Validate required environment variables
    if (!process.env.AZURE_TENANT_ID || !process.env.AZURE_CLIENT_ID || !process.env.AZURE_CLIENT_SECRET) {
      throw new Error('Azure credentials not configured. Please set AZURE_TENANT_ID, AZURE_CLIENT_ID, and AZURE_CLIENT_SECRET.');
    }

    const client = getGraphClient();

    const { recipientEmail, senderEmail, productName, productSlug, datasheetUrl } = formData;

    // Fetch the PDF from CloudFront
    let pdfBase64 = '';
    let pdfFilename = '';
    try {
      const pdfResponse = await fetch(datasheetUrl);
      if (!pdfResponse.ok) {
        throw new Error(`Failed to fetch PDF: ${pdfResponse.statusText}`);
      }
      const pdfBuffer = await pdfResponse.arrayBuffer();
      pdfBase64 = Buffer.from(pdfBuffer).toString('base64');
      // Extract filename from URL (e.g., "HY_606.pdf")
      pdfFilename = datasheetUrl.split('/').pop() || 'datasheet.pdf';
    } catch (fetchError) {
      console.error('Error fetching PDF for attachment:', fetchError);
      // Continue without attachment if fetch fails
    }

    // Get logo as base64 for email embedding
    const logoSrc = getLogoBase64();

    // Format the datasheet email body
    const emailBody = `
      <html>
        <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto;">
          <div style="background-color: #1a1918; padding: 30px; text-align: center;">
            <img src="${logoSrc}" alt="Inmarco FZC Logo" style="max-width: 200px; height: auto; margin-bottom: 10px;" />
          </div>

          <div style="padding: 40px 30px; background-color: #ffffff;">
            <h2 style="color: #1a1918; margin-top: 0; font-size: 24px;">Product Datasheet${senderEmail ? ' Shared With You' : ''}</h2>

            ${senderEmail ? `
              <p style="color: #333; font-size: 16px; line-height: 1.8;">
                Someone has shared a product datasheet with you from Inmarco FZC.
              </p>
            ` : `
              <p style="color: #333; font-size: 16px; line-height: 1.8;">
                Thank you for your interest in our products!
              </p>
            `}

            <div style="background-color: #f5f5f5; border-left: 4px solid #e31e24; padding: 20px; margin: 30px 0; border-radius: 4px;">
              <h3 style="color: #1a1918; margin-top: 0; font-size: 18px;">${productName}</h3>
              <p style="color: #666; font-size: 14px; margin-bottom: 20px;">
                ${pdfBase64 ? 'The complete technical datasheet is attached to this email. You can also access it online using the button below.' : 'Access the complete technical specifications and product details by clicking the button below.'}
              </p>
              <a href="${datasheetUrl}"
                 style="display: inline-block; padding: 12px 30px; background-color: #e31e24; color: white; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">
                Download Datasheet (PDF)
              </a>
            </div>

            <div style="background-color: #f9f9f9; padding: 20px; border-radius: 6px; margin: 30px 0;">
              <h4 style="color: #1a1918; margin-top: 0; font-size: 16px;">Why Choose Inmarco?</h4>
              <ul style="color: #666; font-size: 14px; line-height: 1.8; padding-left: 20px;">
                <li>Quality sealing solutions for demanding applications</li>
                <li>Expert technical support and consultation</li>
                <li>Comprehensive product range</li>
                <li>Fast delivery across the UAE and beyond</li>
              </ul>
            </div>

            <p style="color: #333; font-size: 16px; line-height: 1.8;">
              Need help choosing the right product or have questions about specifications?
            </p>

            <div style="margin: 20px 0;">
              <p style="color: #666; font-size: 14px; margin: 8px 0;">
                <strong>Phone:</strong> <a href="tel:+971559487218" style="color: #e31e24; text-decoration: none;">+971 55 948 7218</a>
              </p>
              <p style="color: #666; font-size: 14px; margin: 8px 0;">
                <strong>Email:</strong> <a href="mailto:techsupport@inmarco.ae" style="color: #e31e24; text-decoration: none;">techsupport@inmarco.ae</a>
              </p>
              <p style="color: #666; font-size: 14px; margin: 8px 0;">
                <strong>Website:</strong> <a href="https://inmarco.ae/products/${productSlug}" style="color: #e31e24; text-decoration: none;">View Product Online</a>
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
              P.O. Box 120284, SAIF-Zone, Sharjah, UAE
            </p>
            <p style="color: #999; font-size: 12px; margin: 5px 0;">
              Working Hours: Monday - Saturday, 8:30 AM - 5:30 PM GST
            </p>
          </div>
        </body>
      </html>
    `;

    const mail: any = {
      message: {
        subject: `${productName} - Technical Datasheet from Inmarco FZC`,
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
        ...(senderEmail && {
          replyTo: [
            {
              emailAddress: {
                address: senderEmail,
              },
            },
          ],
        }),
        // Add PDF attachment if fetched successfully
        ...(pdfBase64 && {
          attachments: [
            {
              '@odata.type': '#microsoft.graph.fileAttachment',
              name: pdfFilename,
              contentType: 'application/pdf',
              contentBytes: pdfBase64,
            },
          ],
        }),
      },
      saveToSentItems: true,
    };

    // Send the datasheet email
    await client
      .api(`/users/${process.env.AZURE_EMAIL_FROM}/sendMail`)
      .post(mail);

    return {
      success: true,
      message: 'Datasheet email sent successfully',
    };
  } catch (error: any) {
    console.error('Error sending datasheet email:', error);
    throw new Error(`Failed to send datasheet email: ${error.message}`);
  }
}
