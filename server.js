


// const express = require("express");
// const cors = require("cors");
// const nodemailer = require("nodemailer");
// const path = require("path");
// require("dotenv").config();

// const app = express();

// app.use(cors());
// app.use(express.json());


// app.use(express.static(path.join(__dirname, "../austria_website/public")));

// app.post("/api/request-demo", async (req, res) => {
//   const { email, message } = req.body;

//   if (!email || !message) {
//     return res.status(400).json({ success: false, error: "Missing fields" });
//   }

//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
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
//         <p><b>User Email:</b> ${email}</p>
//         <p>${message}</p>
//       `,
//     });

//     res.json({ success: true });
//   } catch (err) {
//     console.error("Mail Error:", err);
//     res.status(500).json({ success: false });
//   }
// });

// app.listen(5000, () => {
//   console.log("Backend running on port 5000");
// });






// const express = require("express");
// const cors = require("cors");
// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const app = express();

// // ✅ Middleware
// app.use(cors());
// app.use(express.json());

// // ✅ Health check (Render test)
// app.get("/", (req, res) => {
//   res.send("Backend is running 🚀");
// });

// // ✅ API route
// app.post("/api/request-demo", async (req, res) => {
//   const { email, message } = req.body;

//   if (!email || !message) {
//     return res.status(400).json({
//       success: false,
//       error: "Email and message are required",
//     });
//   }

//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
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
//     res.status(500).json({
//       success: false,
//       error: err.message,
//     });
//   }
// });

// // ✅ Render PORT fix (MOST IMPORTANT)
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log("Backend running on port", PORT);
// });





const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
require("dotenv").config();

const app = express();
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://austria-website.onrender.com" // frontend live URL
  ],
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],
}));

app.use(express.json());

// ✅ Health check
app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

// ✅ Demo Request API
app.post("/api/request-demo", async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ success: false, error: "Email and message required" });
  }

  try {
    // NodeMailer transporter with Brevo SMTP
    const transporter = nodemailer.createTransport({
      host: "smtp-relay.sendinblue.com",
      port: 587,
      secure: false, // TLS false for port 587
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"Austria Website" <${process.env.EMAIL_USER}>`,
      to: process.env.OWNER_EMAIL,
      replyTo: email,
      subject: "New Demo Request",
      html: `
        <h3>New Demo Request</h3>
        <p><b>User Email:</b> ${email}</p>
        <p><b>Message:</b></p>
        <p>${message}</p>
      `,
    });
    
    res.json({ success: true });

  } catch (err) {
    console.error("Mail Error:", err);
    res.status(500).json({ success: false, error: err.message });
  }
});
console.log("OWNER_EMAIL:", process.env.OWNER_EMAIL);



// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
