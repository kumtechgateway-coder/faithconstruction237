const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require("cors")({ origin: true });

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
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { name, email, phone, subject, message, budget, contactMethod } = req.body;

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: functions.config().email.user, // Sending to yourself (the company)
      replyTo: email,
      subject: `New Contact Form Submission: ${subject}`,
      html: `
        <h2>New Contact Request from Website</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone || "N/A"}</p>
        <p><strong>Subject:</strong> ${subject}</p>
        <p><strong>Budget:</strong> ${budget || "N/A"}</p>
        <p><strong>Preferred Contact Method:</strong> ${contactMethod}</p>
        <hr>
        <h3>Message:</h3>
        <p>${message}</p>
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