// // const express = require("express");
// // const cors = require("cors");
// // const nodemailer = require("nodemailer");
// // require("dotenv").config();

// // const app = express();

// // app.use(cors());
// // app.use(express.json());

// // app.post("/api/request-demo", async (req, res) => {
// //     console.log("BODY:", req.body);
// //   console.log("EMAIL_USER:", process.env.EMAIL_USER);
// //   console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
// //   const { email, message } = req.body;

// //   if (!email || !message) {
// //     return res.status(400).json({ success: false });
// //   }

// //   try {
// //     const transporter = nodemailer.createTransport({
// //       service: "gmail",
// //       auth: {
// //         user: process.env.EMAIL_USER,
// //         pass: process.env.EMAIL_PASS,
// //       },
// //     });

// //     await transporter.sendMail({
// //       from: `"Austria Website" <${process.env.EMAIL_USER}>`,
// //       to: process.env.OWNER_EMAIL,
// //       subject: "New Demo Request",
// //       html: `
// //         <h3>New Demo Request</h3>
// //         <p><b>User Email:</b> ${email}</p>
// //         <p>${message}</p>
// //       `,
// //     });

// //     res.json({ success: true });
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ success: false });
// //   }
// // });

// // app.listen(process.env.PORT, () => {
// //   console.log(`Backend running on port ${process.env.PORT}`);
// // });





// const express = require("express");
// const cors = require("cors");
// const nodemailer = require("nodemailer");
// const path = require("path");   
// require("dotenv").config();

// const app = express();
// app.use(cors());
// app.use(express.json());

// // ✅ PUBLIC FOLDER SERVE KARO (MOST IMPORTANT LINE)
// // app.use(express.static(path.join(__dirname, "../public")));
// app.use(express.static(path.join(__dirname, "..", "public")));


// app.post("/api/request-demo", async (req, res) => {
//   const { email, message } = req.body;

//   if (!email || !message) {
//     return res.status(400).json({ success: false, error: "Missing email or message" });
//   }

//   try {
//     const transporter = nodemailer.createTransport({
//       service: "gmail",
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASS,
//       },
//     });

// await transporter.sendMail({
//   from: `"Austria Website" <${process.env.EMAIL_USER}>`,
//   to: process.env.OWNER_EMAIL,
//   replyTo: email,
//   subject: "New Demo Request",
//   html: `
//     <p><b>User Email:</b> ${email}</p>
//     <p>${message}</p>
//   `
// });

//     res.json({ success: true });
//   } catch (err) {
//     console.error("Mail Error:", err);
//     res.status(500).json({ success: false, error: "Failed to send email" });
//   }
// });

// app.listen(process.env.PORT, () => {
//   console.log(`Backend running on port ${process.env.PORT}`);
// });





const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");
const path = require("path");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// ✅ STATIC PUBLIC FOLDER (VERY IMPORTANT)
// app.use(express.static(path.join(__dirname, "..", "public")));
app.use(express.static(path.join(__dirname, "../austria_website/public")));

app.post("/api/request-demo", async (req, res) => {
  const { email, message } = req.body;

  if (!email || !message) {
    return res.status(400).json({ success: false, error: "Missing fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
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
        <p><b>User Email:</b> ${email}</p>
        <p>${message}</p>
      `,
    });

    res.json({ success: true });
  } catch (err) {
    console.error("Mail Error:", err);
    res.status(500).json({ success: false });
  }
});

app.listen(5000, () => {
  console.log("Backend running on port 5000");
});
