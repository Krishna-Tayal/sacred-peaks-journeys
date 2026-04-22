import bcrypt from "bcryptjs";
import crypto from "crypto";
import Admin from "../models/Admin.js";

const OTP_EXPIRY_MINUTES = 10;

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found." });
    }

    if (!admin.passwordHash) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid email or password." });
    }
    
    return res.json({
      success: true,
      token: "dummy-token",
      admin: { email: admin.email },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Login failed." });
  }
};

export const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: "Email is required." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: normalizedEmail });

    if (!admin) {
      return res.json({
        success: true,
        message: "If the email exists, an OTP has been sent.",
      });
    }

    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;
    const otpHash = crypto.createHash("sha256").update(otp).digest("hex");

    admin.resetOtpHash = otpHash;
    admin.resetOtpExpiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    await admin.save();

    // TODO: Replace with email provider integration.
    console.log(`Password reset OTP for ${admin.email}: ${otp}`);

    return res.json({
      success: true,
      message: "OTP sent successfully.",
      ...(process.env.NODE_ENV !== "production" ? { debugOtp: otp } : {}),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to send OTP." });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    if (!email || !otp || !newPassword) {
      return res.status(400).json({ success: false, message: "Email, OTP and new password are required." });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: "New password must be at least 6 characters." });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const admin = await Admin.findOne({ email: normalizedEmail });
    if (!admin || !admin.resetOtpHash || !admin.resetOtpExpiresAt) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    if (admin.resetOtpExpiresAt.getTime() < Date.now()) {
      admin.resetOtpHash = null;
      admin.resetOtpExpiresAt = null;
      await admin.save();
      return res.status(400).json({ success: false, message: "OTP has expired." });
    }

    const otpHash = crypto.createHash("sha256").update(String(otp).trim()).digest("hex");
    if (otpHash !== admin.resetOtpHash) {
      return res.status(400).json({ success: false, message: "Invalid or expired OTP." });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);
    admin.passwordHash = passwordHash;
    admin.resetOtpHash = null;
    admin.resetOtpExpiresAt = null;
    await admin.save();

    return res.json({ success: true, message: "Password updated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to change password." });
  }
};

export const changeEmail = async (req, res) => {
  try {
    const { oldEmail, password, newEmail } = req.body;

    if (!oldEmail || !password || !newEmail) {
      return res.status(400).json({ success: false, message: "Old email, password and new email are required." });
    }

    const normalizedOldEmail = oldEmail.toLowerCase().trim();
    const normalizedNewEmail = newEmail.toLowerCase().trim();

    const admin = await Admin.findOne({ email: normalizedOldEmail });
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found." });
    }

    const isPasswordValid = await bcrypt.compare(password, admin.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    if (normalizedOldEmail === normalizedNewEmail) {
      return res.status(400).json({ success: false, message: "New email must be different from current email." });
    }

    const existingAdminWithNewEmail = await Admin.findOne({ email: normalizedNewEmail });
    if (existingAdminWithNewEmail) {
      return res.status(409).json({ success: false, message: "New email is already in use." });
    }

    admin.email = normalizedNewEmail;
    await admin.save();

    return res.json({ success: true, message: "Admin email updated successfully." });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Failed to change admin email." });
  }
};
