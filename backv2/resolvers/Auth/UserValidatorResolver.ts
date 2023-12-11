import { IResolvers } from "@graphql-tools/utils";
import User, { IUser } from "../../models/userModel";

const userValidatorResolver: IResolvers = {
  Query: {
    getUserData: async (_, {}, { req }): Promise<IUser | null> => {
      try {
        const userId = req.session.userId;

        if (!userId) {
          return null;
        }

        const user = await User.findById(userId);

        return user;
      } catch (err) {
        throw err;
      }
    },
  },
};

export default userValidatorResolver;