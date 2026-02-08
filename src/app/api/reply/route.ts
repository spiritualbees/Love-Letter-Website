import { NextResponse } from "next/server";
import { Redis } from "@upstash/redis";
import nodemailer from "nodemailer";

// Initialize Redis
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function POST(request: Request) {
  try {
    const { answer, message, senderEmail, recipientName } = await request.json();

    // 1. Update Global Counters in Redis
    if (answer === "Yes") {
      await redis.incr("val_yes_clicks");
    }

    // 2. Define the list of Gmail Accounts
    const accounts = [
      { user: process.env.GMAIL_USER_1, pass: process.env.GMAIL_PASS_1 },
      { user: process.env.GMAIL_USER_2, pass: process.env.GMAIL_PASS_2 }
    ];

    // 3. Randomly pick one account
    const selectedAccount = accounts[Math.floor(Math.random() * accounts.length)];
    
    // Safety check: Ensure account exists (in case .env is missing one)
    if (!selectedAccount.user || !selectedAccount.pass) {
      throw new Error("Missing Gmail credentials in .env file");
    }

    console.log(`Sending email using: ${selectedAccount.user}`); // Optional: helps you debug

    // 4. Configure Nodemailer with the SELECTED account
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: selectedAccount.user,
        pass: selectedAccount.pass,
      },
    });

    const mailOptions = {
      // IMPORTANT: The 'from' address must match the account we are using!
      from: `"Valentine App" <${selectedAccount.user}>`, 
      to: senderEmail,
      subject: `💌 ${recipientName} replied: ${answer}!`,
      html: `
        <div style="font-family: sans-serif; padding: 20px; color: #333;">
          <h1 style="color: #e11d48;">Response Received!</h1>
          <p><strong>${recipientName}</strong> just opened your letter.</p>
          <hr />
          <p><strong>Their Answer:</strong> <span style="font-size: 1.2em;">${answer}</span></p>
          <p><strong>Their Message:</strong></p>
          <blockquote style="background: #fdf2f8; padding: 15px; border-left: 4px solid #e11d48;">
            ${message || "No message written."}
          </blockquote>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json({ success: false, error: "Failed to send email" }, { status: 500 });
  }
}