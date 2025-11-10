/**
 * NextAuth 配置
 */

import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { connectDB } from '@/lib/db'
import User from '@/models/User'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: '邮箱', type: 'email' },
        password: { label: '密码', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('邮箱和密码不能为空')
        }

        try {
          await connectDB()

          // 查找用户（包含密码字段）
          const user = await User.findOne({ email: credentials.email }).select(
            '+password'
          )

          if (!user) {
            throw new Error('用户不存在')
          }

          // 验证密码
          const isPasswordValid = await user.comparePassword(
            credentials.password
          )

          if (!isPasswordValid) {
            throw new Error('密码错误')
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            language: user.language,
          }
        } catch (error) {
          console.error('认证错误:', error)
          throw error
        }
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 天
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.language = user.language
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.language = token.language as string
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === 'development',
}

