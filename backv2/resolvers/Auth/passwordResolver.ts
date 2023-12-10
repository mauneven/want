import { IResolvers } from "@graphql-tools/utils";
import bcrypt from "bcrypt";
import { randomBytes } from "crypto";
import nodemailer from "nodemailer";
import User from "../../models/userModel";

const passwordResolver: IResolvers = {
  Mutation: {
    sendResetPasswordEmail: async (_, { email }): Promise<{ message: string }> => {
      const user = await User.findOne({ email: email });

      if (!user) {
        return { message: "If an account with that email exists, we have sent a reset link to it." };
      }

      const resetToken = randomBytes(20).toString('hex');
      const resetExpires = new Date(Date.now() + 3600000);

      user.resetPasswordToken = resetToken;
      user.resetPasswordExpires = resetExpires;
      await user.save();

      const transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
          user: 'wanttests@gmail.com',
          pass: 'hgdxskaqpsunouin', 
        },
      });

      const resetLink = `http://localhost:3000/changePassword?token=${resetToken}`;

      try {
        await transporter.sendMail({
          from: 'Support from Want',
          to: user.email,
          subject: 'Reset Your Password',
          html: `
            <p>You have requested to reset your password. Please click on the link below to proceed:</p>
            <a href="${resetLink}">${resetLink}</a>
            <p>If you did not request this, please ignore this email.</p>
          `,
        });
      } catch (error) {
        console.error('Error sending email:', error);
      }      

      return { message: "We have sent a reset link to your email." };
    },
},
};

export default passwordResolver;