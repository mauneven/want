import { IResolvers } from "@graphql-tools/utils";
import bcrypt from "bcrypt";
import User, { IUser } from "../../models/userModel";

const loginResolver: IResolvers = {
  Mutation: {
    login: async (_, { input }, {req}): Promise<IUser> => {
    try {
        const { email, password } = input;

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            throw new Error("Invalid email or password");
        }

        // Check password
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            throw new Error("Invalid email or password");
        }

        req.session.userId = user._id;

        return {
            ...user.toJSON(),
            password: user.password,
            phone: user.phone,
            role: user.role,
            totalPosts: user.totalPosts,
            totalOffers: user.totalOffers,
            isDeleted: user.isDeleted,
            isBlocked: user.isBlocked,
            reports: user.reports,
        };

    } catch (err) {
        throw err;
    }
    },
  },
};

export default loginResolver;