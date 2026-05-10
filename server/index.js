import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendContactEmail } from './emailService.js';

// Load environment variables
dotenv.config({ path: '.env.local' });

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'API server is running' });
});

// Contact form endpoint
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, phone, company, enquiryType, message } = req.body;

    // Validation
    if (!name || !email || !message || !enquiryType) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: name, email, enquiryType, and message are required',
      });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address',
      });
    }

    // Send email
    const result = await sendContactEmail({
      name,
      email,
      phone,
      company,
      enquiryType,
      message,
    });

    res.json(result);
  } catch (error) {
    console.error('Contact form error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to process contact form',
      error: error.message,
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message,
  });
});

app.listen(PORT, () => {
  console.log(`API server running on http://localhost:${PORT}`);
});
