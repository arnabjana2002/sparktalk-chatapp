import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_TOKEN_SECRET, {
    expiresIn: process.env.JWT_TOKEN_EXPIRY,
  });

  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // milliseconds
    httpOnly: true, // Prevents XSS Attacks -> Cross-site Scripting Attacks
    sameSite: true, // Prevents CSRF Attacks -> Cross-site Request Forgery Attacks
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
