import User from '../models/index.js';
import { signToken, AuthenticationError } from '../services/auth.js';

interface User {
  username: string;
  email: string;
  password: string;
  _id: string;
}

interface LoginArgs {
  input:{
    email: string;
    password: string;
  }
}

interface AddUserArgs {
  input:{
    userName: string;
    email: string;
    password: string;
    _id: string;
  }
}

interface SaveBookArgs {
  input:{
    author: [string];
    description: string;
    title: string;
    bookId: string;
    image: string;
    link: string
  }
}
interface RemoveBookArgs {
    bookId: string
  }


interface Context {
  user?: User;
}

const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: Context): Promise<User | null> => {
      if (context.user) {
        return await User.findOne({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
  },
  Mutation: {
    addUser: async (_parent: any, { input }: AddUserArgs): Promise<{ token: string; profile: User }> => {
      const user = await User.create({ ...input });
      const token = signToken(user.email, user.username);
      return { token, profile: user as User };
    },
    login: async (_parent: any, { input: { email, password } }: LoginArgs) => {
      const user = await User.findOne({ email });
    
      // If no user is found, throw an AuthenticationError
      if (!user) {
        throw new AuthenticationError('Could not authenticate user.');
      }
    
      // Check if the provided password is correct
      const correctPw = await user.isCorrectPassword(password);
    
      // If the password is incorrect, throw an AuthenticationError
      if (!correctPw) {
        throw new AuthenticationError('Could not authenticate user.');
      }
    
      // Sign a token with the user's information
      const token = signToken(user.username, user.email);
    
      // Return the token and the user
      return { token, user };
    },
    saveBook: async (_parent: any, args: SaveBookArgs, context: Context): Promise<User | null> => {
      if (context.user) {
        return await User.findOneAndUpdate(
          { _id: context.user._id},
          {
            $addToSet: { savedBooks:args },
          },
          {
            new: true,
            runValidators: true,
          }
        );
      }
      throw AuthenticationError;
    },
    removeProfile: async (_parent: any, _args: any, context: Context): Promise<User | null> => {
      if (context.user) {
        return await User.findOneAndDelete({ _id: context.user._id });
      }
      throw AuthenticationError;
    },
    removeBook: async (_parent: any, { bookId }: RemoveBookArgs, context: Context): Promise<User | null> => {
      if (context.bookId) {
        return await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: {  } },
          { new: true }
        );
      }
      throw AuthenticationError;
    },
  },
};

export default resolvers;
