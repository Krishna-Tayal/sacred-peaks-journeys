import bcrypt from "bcryptjs";
import Admin from "../models/Admin.js";

export const ensureAdminUser = async () => {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    console.log("ADMIN_EMAIL or ADMIN_PASSWORD is not set. Skipping admin bootstrap.");
    return;
  }

  const normalizedEmail = email.toLowerCase().trim();
  const existingAdmin = await Admin.findOne({ email: normalizedEmail });

  if (existingAdmin) {
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await Admin.create({ email: normalizedEmail, passwordHash });
  console.log(`Admin user created for ${normalizedEmail}`);
};
