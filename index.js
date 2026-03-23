const functions = require("firebase-functions");
const nodemailer = require("nodemailer");

// SECURITY: Restrict CORS to your domain(s) to prevent unauthorized use of your API
// Update this list with your production domain and local development server
const allowedOrigins = ["https://www.faithconstruction237.com", "http://localhost:5500", "http://127.0.0.1:5500"];
const cors = require("cors")({ origin: allowedOrigins });

// Configure the email transport using the default SMTP transport and a GMail account.
// For Gmail, enable 2-step verification and generate an App Password.
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: functions.config().email.user,
    pass: functions.config().email.pass,
  },
});

exports.submitContactForm = functions.https.onRequest((req, res) => {
  cors(req, res, async () => {
    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { name, email, phone, subject, message, budget, contactMethod } =
      req.body;

    // --- Security Hardening ---
    // 1. Sanitize inputs to prevent HTML injection in the email body.
    const sanitize = (str) =>
      str ? String(str).replace(/</g, "&lt;").replace(/>/g, "&gt;") : "";

    // 2. Sanitize inputs for email headers to prevent Email Header Injection.
    const sanitizeHeader = (str) =>
      str ? String(str).replace(/[\r\n]/g, "") : "";

    const safeName = sanitizeHeader(name);
    const safeEmail = sanitizeHeader(email);
    const safeSubject = sanitizeHeader(subject) || "Website Inquiry";
    const safeMessage = String(message || "").trim();

    // Validate Email Format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!safeEmail || !emailRegex.test(safeEmail)) {
      return res.status(400).send({ success: false, error: "Valid email is required." });
    }
    if (!safeName) {
      return res.status(400).send({ success: false, error: "Name is required." });
    }
    if (!safeMessage) {
      return res.status(400).send({ success: false, error: "Message is required." });
    }

    const mailOptions = {
      from: `"${safeName}" <${functions.config().email.user}>`, // Send from your own authorized address
      to: functions.config().email.user, // Sending to yourself (the company)
      replyTo: safeEmail, // Set the user's email for easy replies
      subject: `New Contact Form Submission: ${safeSubject}`,
      html: `
        <h2>New Contact Request from Website</h2>
        <p><strong>Name:</strong> ${sanitize(name)}</p>
        <p><strong>Email:</strong> ${sanitize(email)}</p>
        <p><strong>Phone:</strong> ${sanitize(phone) || "N/A"}</p>
        <p><strong>Subject:</strong> ${sanitize(safeSubject)}</p>
        <p><strong>Budget:</strong> ${sanitize(budget) || "N/A"}</p>
        <p><strong>Preferred Contact Method:</strong> ${sanitize(contactMethod)}</p>
        <hr>
        <h3>Message:</h3>
        <p>${sanitize(safeMessage)}</p>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      res.status(200).send({ success: true, message: "Email sent successfully" });
    } catch (error) {
      console.error("Error sending email:", error);
      res.status(500).send({ success: false, error: error.toString() });
    }
  });
});
