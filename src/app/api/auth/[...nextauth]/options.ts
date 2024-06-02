// import { NextAuthOptions } from "next-auth";
// import CredentialsProvider from "next-auth/providers/credentials";
// import bcrypt from "bcryptjs";
// import dbConnect from "@/lib/dbconnect";
// import usermodel from "@/Models/User.model";

// export const   authOptions: NextAuthOptions = {
//   providers: [
//     CredentialsProvider({
//       id: "credentials",
//       name: "credentials",
//       credentials: {
//         email: {
//           label: "Email",
//           type: "text",
//           placeholder: "Enter your email",
//         },
//         password: { label: "Password", type: "password" },
//       },
//       async authorize(credentials: any): Promise<any> {
//         await dbConnect();
//         try {
//           const user = await usermodel.findOne({ email: credentials.email });
//           if (!user) {
//             throw new Error("No user found with this email");
//           }
//           if (!user.isVerified) {
//             throw new Error("Please verify your account first");
//           }
//           const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
//           if (!isPasswordValid) {
//             throw new Error("Incorrect password");
//           }
//           return user;
//         } catch (error: any) {
//           throw new Error(error.message || "Authentication failed");
//         }
//       },
//     }),
//   ],
//   callbacks: {
//     async jwt({ token, user }) {
//       if (user) {
//         token._id = user._id?.toString();
//         token.isVerified = user.isVerified;
//         token.isAcceptingMessages = user.isAcceptingMessages;
//         token.userName = user.userName;
//       }
//       return token;
//     },
//     async session({ session, token }) {
//       if (token) {
//         session.user.userName = token.userName;
//         session.user._id = token._id;
//         session.user.isAcceptingMessages = token.isAcceptingMessages;
//         session.user.isVerified = token.isVerified;
//       }
//       return session;
//     },
//   },
//   session: {
//     strategy: "jwt",
//   },
//   secret: process.env.NEXTAUTH_SECRET,
//   pages: {
//     signIn: "/sign-in",
//   },

// };

import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import dbConnect from "@/lib/dbconnect";
import usermodel from "@/Models/User.model";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: {
          label: "Email",
          type: "text",
          placeholder: "Enter your email",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await dbConnect();
        try {
          const user = await usermodel.findOne({ email: credentials.email });
          if (!user) {
            throw new Error("No user found with this email");
          }
          if (!user.isVerified) {
            throw new Error("Please verify your account first");
          }
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          if (!isPasswordValid) {
            throw new Error("Incorrect password");
          }
          return user;
        } catch (error: any) {
          throw new Error(error.message || "Authentication failed");
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
        token.userName = user.userName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.userName = token.userName;
        session.user._id = token._id;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.isVerified = token.isVerified;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/sign-in",
  },
};
