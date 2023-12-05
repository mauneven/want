import { IResolvers } from "@graphql-tools/utils";
import bcrypt from "bcrypt";
import {
  generateVerificationCode,
  sendVerificationEmail,
} from "./VerificationResolver";
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
    register: async (_, { input }): Promise<IUser> => {
      try {
        const { email, password, firstName, lastName, birthdate } = input;

        const userExists = await User.findOne({ email });
        if (userExists) {
          throw new Error("User already exists");
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const user = new User({
          email,
          password: hashedPassword,
          firstName,
          lastName,
          birthdate,
        });

        const token = generateVerificationCode(); 

        const tokenString = String(token);
        
        const encryptedToken = await bcrypt.hash(tokenString, salt);

        user.verificationCode = encryptedToken;
        user.verificationCodeExpires = new Date(Date.now() + 1800000); // Verification code expires in 30 minutes

        await user.save();

        await sendVerificationEmail(email, token);

        return user;
      } catch (err) {
        throw err;
      }
    },
  },
};

export default registerResolver;
