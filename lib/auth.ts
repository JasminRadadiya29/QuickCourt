import CredentialsProvider from 'next-auth/providers/credentials';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        await connectToDatabase();
        const user = await User.findOne({ email: credentials?.email });
        if (!user || typeof credentials?.password !== 'string' || typeof user.passwordHash !== 'string') return null;
        const isValid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!isValid) return null;
        return { id: user._id.toString(), name: user.name, email: user.email, role: user.role } as any;
      }
    })
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) token.role = (user as any).role;
      return token;
    },
    async session({ session, token }: any) {
      (session as any).user.role = token.role;
      return session;
    }
  }
};
