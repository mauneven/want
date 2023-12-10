import { IResolvers } from "@graphql-tools/utils";
import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import User from "../../models/userModel";

interface GenerateVerificationCodeResponse {
  code: string;
}

const verificationResolver: IResolvers = {
  Mutation: {
    generateVerificationCode:
      async (): Promise<GenerateVerificationCodeResponse> => {
        const code = generateVerificationCode();
        return { code };
      },
    sendVerificationEmail: async (
      _,
      args: { email: string; verificationCode: string }
    ): Promise<boolean> => {
      const { email, verificationCode } = args;
      try {
        await sendVerificationEmail(email, verificationCode);
        return true;
      } catch (err) {
        console.error("Error sending verification email:", err);
        return false;
      }
    },
    resendVerificationCode: async (
      _,
      args: { email: string }
    ): Promise<boolean> => {
      const { email } = args;
      try {
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("User with that email does not exist");
        }

        if (user.isVerified) {
          throw new Error("User is already verified");
        }

        const code = generateVerificationCode();
        const salt = await bcrypt.genSalt(10);
        const encryptedCode = await bcrypt.hash(code, salt);

        user.verificationCode = encryptedCode;
        user.verificationCodeExpires = new Date(Date.now() + 1800000);
        await user.save();

        await sendVerificationEmail(email, code);
        return true;
      } catch (err) {
        console.error("Error resending verification code:", err);
        return false;
      }
    },
    verifyUser: async (
      _,
      args: { verificationCode: string }
    ): Promise<string> => {
      const { verificationCode } = args;

      if (!verificationCode) {
        throw new Error("Verification code is required");
      }

      const user = await User.findOne({
        verificationCodeExpires: { $gt: new Date() },
      });

      if (!user) {
        throw new Error("Invalid verification code");
      }

      if (
        !user.verificationCodeExpires ||
        user.verificationCodeExpires <= new Date()
      ) {
        throw new Error("Expired verification code");
      }

      const isCodeValid = await bcrypt.compare(
        String(verificationCode),
        String(user.verificationCode)
      );

      if (!isCodeValid) {
        throw new Error("Invalid verification code");
      }

      if (user.isVerified) {
        throw new Error("Already verified");
      }

      user.isVerified = true;
      user.verificationCode = "";
      user.verificationCodeExpires = null;
      await user.save();

      return "User successfully verified";
    },
  },
};

const generateVerificationCode = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const sendVerificationEmail = async (
  email: string,
  verificationCode: string
): Promise<void> => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "wanttests@gmail.com",
      pass: "hgdxskaqpsunouin",
    },
  });

  const mailOptions = {
    from: `Want code ${verificationCode} | Verification <wanttests@gmail.com>`,
    to: email,
    subject: "Verify Your Account",
    html: `
      <p>You are one step away from verifying your account on Want. If you want to proceed, enter the following verification code:</p>
      <h2>${verificationCode}</h2>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("Verification email sent");
  } catch (err) {
    console.error("Error sending verification email:", err);
  }
};

export { generateVerificationCode, sendVerificationEmail, verificationResolver };