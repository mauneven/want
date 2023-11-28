import { IResolvers } from "@graphql-tools/utils";
import bcrypt from 'bcrypt';
import { generateVerificationCode, sendVerificationEmail } from './VerificationResolver';
import User, { IUser } from "../../models/userModel";

interface RegisterArgs {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthdate: string;
}

const registerResolver: IResolvers = {
  Mutation: {
    register: async (_, args: RegisterArgs): Promise<IUser> => {
      try {
        const {
          email,
          password,
          firstName,
          lastName,
          birthdate,
        } = args;

        // Check if user already exists
        const userExists = await User.findOne({ email });
        if (userExists) {
          throw new Error("User already exists");
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const user = new User({
          email,
          password: hashedPassword,
          firstName,
          lastName,
          birthdate,
        });

        // Generate verification token
        const token = generateVerificationCode(); // Generate a random 6-digit verification code

        // Encrypt verification code
        const encryptedToken = await bcrypt.hash(token, salt);

        // Assign encrypted verification code and expiration time to the user
        user.verificationCode = encryptedToken;
        user.verificationCodeExpires = new Date(Date.now() + 1800000); // Verification code expires in 30 minutes

        await user.save();

        // Send verification email
        await sendVerificationEmail(email, token);

        return user;
      } catch (err) {
        throw err;
      }
    },
  },
};

export default registerResolver;