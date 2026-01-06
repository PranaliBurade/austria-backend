

// const express = require("express");
// const cors = require("cors");
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const app = express();
// app.use(cors({
//   origin: [
//     "http://localhost:5173",
//     "https://austria-frontend.onrender.com"

//   ],
//   methods: ["GET", "POST"],
//   allowedHeaders: ["Content-Type"],
// }));

// app.use(express.json());

// // ✅ Health check
// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// });

// // ✅ Demo Request API
// app.post("/api/request-demo", async (req, res) => {
//   const { email, message } = req.body;

//   if (!email || !message) {
//     return res.status(400).json({ success: false, error: "Email and message required" });
//   }

//   try {
//     // NodeMailer transporter with Brevo SMTP
//     const transporter = nodemailer.createTransport({
//       host: "smtp-relay.sendinblue.com",
//       port: 587,
//       secure: false, // TLS false for port 587
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

//     await transporter.sendMail({
//       from: `"Austria Website" <${process.env.EMAIL_USER}>`,
//       to: process.env.OWNER_EMAIL,
//       replyTo: email,
//       subject: "New Demo Request",
//       html: `
//         <h3>New Demo Request</h3>
//         <p><b>User Email:</b> ${email}</p>
//         <p><b>Message:</b></p>
//         <p>${message}</p>
//       `,
//     });
    
//     res.json({ success: true });

//   } catch (err) {
//     console.error("Mail Error:", err);
//     res.status(500).json({ success: false, error: err.message });
//   }
// });
// console.log("OWNER_EMAIL:", process.env.OWNER_EMAIL);



// // ✅ Start server
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));






const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// ✅ CORS - sab URLs allow karo
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://austria-frontend.onrender.com",
    "https://astraforge.io"
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
  credentials: true
}));

app.use(express.json());

// ✅ Health check endpoint
app.get("/", (req, res) => {
  res.json({ 
    status: "running",
    message: "Backend is alive 🚀",
    timestamp: new Date().toISOString()
  });
});

// ✅ Test endpoint - check env variables
app.get("/api/test", (req, res) => {
  res.json({
    hasApiKey: !!process.env.BREVO_API_KEY,
    hasOwnerEmail: !!process.env.OWNER_EMAIL,
    emailUser: process.env.EMAIL_USER
  });
});

// ✅ Demo Request API - Brevo REST API
app.post("/api/request-demo", async (req, res) => {
  const { email, message } = req.body;

  console.log("📧 Request received:", { email, messageLength: message?.length });

  // Validation
  if (!email || !message) {
    return res.status(400).json({ 
      success: false, 
      error: "Email and message are required" 
    });
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ 
      success: false, 
      error: "Invalid email format" 
    });
  }

  try {
    // 🔥 Brevo API Call (No SMTP needed!)
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": process.env.BREVO_API_KEY
      },
      body: JSON.stringify({
        sender: {
          name: "Austria Website",
          email: process.env.EMAIL_USER || "noreply@yourdomain.com"
        },
        to: [{
          email: process.env.OWNER_EMAIL,
          name: "Website Owner"
        }],
        replyTo: {
          email: email,
          name: "Demo Requester"
        },
        subject: "🎯 New Demo Request - Austria Website",
        htmlContent: `
          <!DOCTYPE html>
          <html>
          <head>
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); 
                        color: white; padding: 20px; border-radius: 8px 8px 0 0; }
              .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
              .info-box { background: white; padding: 15px; margin: 15px 0; 
                         border-left: 4px solid #667eea; border-radius: 4px; }
              .label { font-weight: bold; color: #667eea; margin-bottom: 5px; }
              .value { color: #333; }
              .footer { text-align: center; margin-top: 20px; color: #888; font-size: 12px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0;">🎯 New Demo Request</h2>
              </div>
              <div class="content">
                <div class="info-box">
                  <div class="label">👤 User Email:</div>
                  <div class="value">${email}</div>
                </div>
                <div class="info-box">
                  <div class="label">💬 Message:</div>
                  <div class="value">${message.replace(/\n/g, '<br>')}</div>
                </div>
                <div class="info-box">
                  <div class="label">🕐 Received At:</div>
                  <div class="value">${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}</div>
                </div>
                <div class="footer">
                  <p>This email was sent from Austria Website demo request form</p>
                </div>
              </div>
            </div>
          </body>
          </html>
        `
      })
    });

    const data = await response.json();

    if (response.ok) {
      console.log("✅ Email sent successfully via Brevo API");
      res.json({ 
        success: true,
        messageId: data.messageId 
      });
    } else {
      console.error("❌ Brevo API Error:", data);
      res.status(500).json({ 
        success: false, 
        error: data.message || "Failed to send email via Brevo" 
      });
    }

  } catch (err) {
    console.error("💥 Server Error:", err.message);
    res.status(500).json({ 
      success: false, 
      error: `Server error: ${err.message}` 
    });
  }
});

// ✅ 404 handler
app.use((req, res) => {
  res.status(404).json({ error: "Route not found" });
});

// ✅ Error handler
app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📧 Owner Email: ${process.env.OWNER_EMAIL}`);
  console.log(`🔑 Brevo API Key: ${process.env.BREVO_API_KEY ? '✅ Set' : '❌ Missing'}`);
});