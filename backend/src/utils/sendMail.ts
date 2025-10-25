// import resend from "../config/resend";
// import { EMAIL_SENDER, NODE_ENV } from "../constants/env";

// type Params = {
//   to: string;
//   subject: string;
//   text: string;
//   html: string;
// };

// const getFromEmail = () =>
//   NODE_ENV === "development" ? "onboarding@resend.dev" : EMAIL_SENDER;

// const getToEmail = (to: string) =>
//   NODE_ENV === "development" ? "delivered@resend.dev" : to;

// export const sendMail = async ({ to, subject, text, html }: Params) =>
//   await resend.emails.send({
//     from: getFromEmail(),
//     to: getToEmail(to),
//     subject,
//     text,
//     html,
//   });

import nodemailer from "nodemailer";
import {
  APP_ORIGIN,
  EMAIL_SERVICE,
  GMAIL_PASS,
  GMAIL_USER,
} from "../constants/env";

const transporter = nodemailer.createTransport({
  service: EMAIL_SERVICE,
  auth: {
    user: GMAIL_USER,
    pass: GMAIL_PASS,
  },
});

export const sendTwoFACode = async (
  email: string,
  code: string
): Promise<void> => {
  await transporter.sendMail({
    from: `"Your App" <${GMAIL_USER}>`,
    to: email,
    subject: "Your Two-Factor Authentication Code",
    html: `
      <p>Your verification code is: <strong>${code}</strong></p>
      <p>This code will expire in 5 minutes.</p>
    `,
  });
};

export const sendVerificationEmail = async (
  email: string,
  verificationCode: string
): Promise<void> => {
  const verificationUrl = `${APP_ORIGIN}/confirm-account?code=${verificationCode}`;

  await transporter.sendMail({
    from: `"Your App" <${GMAIL_USER}>`,
    to: email,
    subject: "Email Verification",
    html: `
      <p>Thank you for registering! Please verify your email by clicking the link below:</p>
      <a href="${verificationUrl}">${verificationUrl}</a>
      <p>This link will expire in 24 hours.</p>
    `,
  });
};

export const sendForgotPasswordEmail = async (
  email: string,
  url: string
): Promise<void> => {
  // const url = `${APP_ORIGIN}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Your App" <${GMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html: `
      <p>You requested a password reset. Click the link below to reset your password:</p>
      <a href="${url}">${url}</a>
      <p>This link will expire in 1 hour.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `,
  });
};

export const sendMagicLoginEmail = async (email: string, url: string) => {
  await transporter.sendMail({
    from: `"Your App" <${GMAIL_USER}>`,
    to: email,
    subject: "Your Magic Login Link",
    html: `
      <p>Click the link below to log in to your account:</p>
      <a href="${url}">${url}</a>
      <p>This link will expire in 5 minutes.</p>
    `,
  });
};
