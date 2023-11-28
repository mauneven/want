import User, { IUser } from '../models/userModel';
import { IResolvers } from '@graphql-tools/utils';

interface UserArgs {
  id: string;
}

interface CreateUserArgs {
  email: string;
  password: string;
}

const userResolver: IResolvers = {
  Query: {
    users: async (): Promise<IUser[]> => {
      return await User.find();
    },
    user: async (_, args: UserArgs): Promise<IUser | null> => {
      return await User.findById(args.id);
    },
  },
  Mutation: {
    createUser: async (_, args: CreateUserArgs): Promise<IUser> => {
      const { email, password } = args;
      const user = new User({ email, password });
      await user.save();
      return user;
    },
  },
};

export default userResolver;
