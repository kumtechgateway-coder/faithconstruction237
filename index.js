const functions = require("firebase-functions");
const nodemailer = require("nodemailer");
const cors = require("cors");

const allowedOrigins = new Set([
  "https://www.faithconstruction237.com",
  "http://localhost:5500",
  "http://127.0.0.1:5500",
]);
const allowedContactMethods = new Set(["email", "phone", "whatsapp"]);
const maxFieldLengths = {
  name: 120,
  email: 254,
  phone: 40,
  subject: 180,
  budget: 120,
  service: 180,
  message: 4000,
};
const rateLimitWindowMs = 10 * 60 * 1000;
const maxRequestsPerWindow = 3;
const requestLog = new Map();

const emailConfig = functions.config().email || {};
const smtpUser = emailConfig.user || "";
const smtpPass = emailConfig.pass || "";

const corsMiddleware = cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.has(origin)) {
      callback(null, true);
      return;
    }

    callback(new Error("Origin not allowed"));
  },
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: smtpUser,
    pass: smtpPass,
  },
});

function escapeHtml(value) {
  if (value === null || value === undefined) {
    return "";
  }

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function normalizeText(value, maxLength) {
  return String(value || "").trim().slice(0, maxLength);
}

function normalizeHeader(value, maxLength) {
  return normalizeText(value, maxLength).replace(/[\r\n]+/g, " ");
}

function formatMessageForHtml(value) {
  return escapeHtml(value).replace(/\n/g, "<br>");
}

function getClientIp(req) {
  const forwardedFor = req.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  return req.ip || "";
}

function isRateLimited(ipAddress) {
  const now = Date.now();

  for (const [loggedIp, timestamps] of requestLog.entries()) {
    const recentTimestamps = timestamps.filter(
      (timestamp) => now - timestamp < rateLimitWindowMs,
    );

    if (recentTimestamps.length) {
      requestLog.set(loggedIp, recentTimestamps);
    } else {
      requestLog.delete(loggedIp);
    }
  }

  const recentRequests = requestLog.get(ipAddress) || [];
  if (recentRequests.length >= maxRequestsPerWindow) {
    return true;
  }

  recentRequests.push(now);
  requestLog.set(ipAddress, recentRequests);
  return false;
}

exports.submitContactForm = functions.https.onRequest((req, res) => {
  corsMiddleware(req, res, async (corsError) => {
    if (corsError) {
      return res.status(403).send({
        success: false,
        error: "This origin is not allowed to submit requests.",
      });
    }

    if (req.method === "OPTIONS") {
      return res.status(204).send("");
    }

    if (req.method !== "POST") {
      return res.status(405).send({
        success: false,
        error: "Method Not Allowed",
      });
    }

    const requestOrigin = req.get("origin") || "";
    const requestReferer = req.get("referer") || "";
    const hasTrustedSource = Array.from(allowedOrigins).some(
      (allowedOrigin) =>
        requestOrigin === allowedOrigin ||
        requestReferer.startsWith(`${allowedOrigin}/`) ||
        requestReferer === allowedOrigin,
    );

    if (!hasTrustedSource) {
      return res.status(403).send({
        success: false,
        error: "Only requests from the FAITH Construction website are allowed.",
      });
    }

    if (!smtpUser || !smtpPass) {
      console.error("Missing email configuration for contact form delivery.");
      return res.status(500).send({
        success: false,
        error: "Contact service is not configured yet.",
      });
    }

    const contentType = (req.get("content-type") || "").toLowerCase();
    if (!contentType.startsWith("application/json")) {
      return res.status(415).send({
        success: false,
        error: "Requests must be sent as JSON.",
      });
    }

    const clientIp = getClientIp(req) || "unknown";
    if (isRateLimited(clientIp)) {
      return res.status(429).send({
        success: false,
        error: "Too many requests. Please wait a few minutes and try again.",
      });
    }

    const {
      name,
      email,
      phone,
      subject,
      message,
      budget,
      contactMethod,
      service,
      website,
      formStartedAt,
    } = req.body || {};

    if (website) {
      return res.status(400).send({
        success: false,
        error: "Unable to submit your request.",
      });
    }

    const startedAt = Number(formStartedAt);
    if (Number.isFinite(startedAt) && Date.now() - startedAt < 1500) {
      return res.status(400).send({
        success: false,
        error: "Please take a moment to complete the form before submitting.",
      });
    }

    const safeName = normalizeHeader(name, maxFieldLengths.name);
    const safeEmail = normalizeHeader(email, maxFieldLengths.email).toLowerCase();
    const safePhone = normalizeHeader(phone, maxFieldLengths.phone);
    const safeSubject = normalizeHeader(subject, maxFieldLengths.subject);
    const safeBudget = normalizeHeader(budget, maxFieldLengths.budget);
    const safeService = normalizeHeader(service, maxFieldLengths.service);
    const safeMessage = normalizeText(message, maxFieldLengths.message);
    const safeContactMethod = normalizeHeader(contactMethod, 20).toLowerCase();

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!safeName) {
      return res.status(400).send({
        success: false,
        error: "Name is required.",
      });
    }
    if (!safeEmail || !emailRegex.test(safeEmail)) {
      return res.status(400).send({
        success: false,
        error: "A valid email address is required.",
      });
    }
    if (!safeMessage) {
      return res.status(400).send({
        success: false,
        error: "Please include a short project message.",
      });
    }
    if (
      safeContactMethod &&
      !allowedContactMethods.has(safeContactMethod)
    ) {
      return res.status(400).send({
        success: false,
        error: "Preferred contact method is invalid.",
      });
    }

    const mailSubjectBase = safeSubject || "Website Inquiry";
    const mailSubject = safeService
      ? `${mailSubjectBase} | ${safeService}`
      : mailSubjectBase;

    const textBody = [
      "New contact request from the FAITH Construction website",
      "",
      `Name: ${safeName}`,
      `Email: ${safeEmail}`,
      `Phone: ${safePhone || "N/A"}`,
      `Preferred Contact Method: ${safeContactMethod || "email"}`,
      `Service: ${safeService || "General Inquiry"}`,
      `Budget: ${safeBudget || "Not specified"}`,
      `Subject: ${mailSubjectBase}`,
      "",
      "Message:",
      safeMessage,
    ].join("\n");

    const htmlBody = `
      <h2>New Contact Request from Website</h2>
      <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
      <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
      <p><strong>Phone:</strong> ${escapeHtml(safePhone) || "N/A"}</p>
      <p><strong>Preferred Contact Method:</strong> ${escapeHtml(safeContactMethod || "email")}</p>
      <p><strong>Service:</strong> ${escapeHtml(safeService) || "General Inquiry"}</p>
      <p><strong>Budget:</strong> ${escapeHtml(safeBudget) || "Not specified"}</p>
      <p><strong>Subject:</strong> ${escapeHtml(mailSubjectBase)}</p>
      <hr>
      <h3>Message</h3>
      <p>${formatMessageForHtml(safeMessage)}</p>
    `;

    try {
      await transporter.sendMail({
        from: `"FAITH Website" <${smtpUser}>`,
        to: smtpUser,
        replyTo: `"${safeName}" <${safeEmail}>`,
        subject: `New Contact Form Submission: ${mailSubject}`,
        text: textBody,
        html: htmlBody,
      });

      return res.status(200).send({
        success: true,
        message: "Your request has been sent successfully.",
      });
    } catch (error) {
      console.error("Error sending contact form email:", error);
      return res.status(500).send({
        success: false,
        error:
          "We could not send your request right now. Please try again or contact us by phone or WhatsApp.",
      });
    }
  });
});
