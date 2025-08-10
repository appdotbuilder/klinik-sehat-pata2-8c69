import { initTRPC, TRPCError } from '@trpc/server';
import { createHTTPServer } from '@trpc/server/adapters/standalone';
import 'dotenv/config';
import cors from 'cors';
import superjson from 'superjson';
import { z } from 'zod';
import { 
  registerUserInputSchema, 
  loginUserInputSchema, 
  updateUserInputSchema, 
  changePasswordInputSchema,
  type JwtPayload 
} from './schema';
import { registerUser } from './handlers/register_user';
import { loginUser } from './handlers/login_user';
import { getUserProfile } from './handlers/get_user_profile';
import { getAllUsers } from './handlers/get_all_users';
import { updateUser } from './handlers/update_user';
import { changePassword } from './handlers/change_password';
import { verifyToken } from './handlers/verify_token';
import { deleteUser } from './handlers/delete_user';

// Context interface
interface Context {
  user?: JwtPayload;
}

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

const publicProcedure = t.procedure;
const router = t.router;

// Authentication middleware
const authenticatedProcedure = publicProcedure.use(async ({ ctx, next }) => {
  // This is a placeholder middleware! Real implementation should:
  // 1. Extract JWT token from Authorization header
  // 2. Verify token using verifyToken handler
  // 3. Add user info to context
  // 4. Throw TRPCError if token is invalid
  
  // For now, we'll just pass through without authentication
  return next({
    ctx: {
      ...ctx,
      user: {
        userId: '00000000-0000-0000-0000-000000000000',
        email: 'placeholder@example.com',
        role: 'admin' as const
      }
    }
  });
});

// Admin-only middleware
const adminProcedure = authenticatedProcedure.use(async ({ ctx, next }) => {
  if (!ctx.user || ctx.user.role !== 'admin') {
    throw new TRPCError({
      code: 'FORBIDDEN',
      message: 'Admin access required'
    });
  }
  
  return next({
    ctx
  });
});

const appRouter = router({
  // Health check
  healthcheck: publicProcedure.query(() => {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }),

  // Authentication routes
  register: publicProcedure
    .input(registerUserInputSchema)
    .mutation(({ input }) => registerUser(input)),

  login: publicProcedure
    .input(loginUserInputSchema)
    .mutation(({ input }) => loginUser(input)),

  // User profile routes
  getProfile: authenticatedProcedure
    .query(({ ctx }) => getUserProfile(ctx.user!.userId)),

  updateProfile: authenticatedProcedure
    .input(updateUserInputSchema)
    .mutation(({ input, ctx }) => {
      // Users can only update their own profile unless they're admin
      if (input.id !== ctx.user!.userId && ctx.user!.role !== 'admin') {
        throw new TRPCError({
          code: 'FORBIDDEN',
          message: 'You can only update your own profile'
        });
      }
      return updateUser(input);
    }),

  changePassword: authenticatedProcedure
    .input(changePasswordInputSchema)
    .mutation(({ input, ctx }) => changePassword(ctx.user!.userId, input)),

  // Admin-only routes
  getAllUsers: adminProcedure
    .query(() => getAllUsers()),

  deleteUser: adminProcedure
    .input(z.object({ userId: z.string().uuid() }))
    .mutation(({ input }) => {
      // Prevent admin from deleting themselves
      // This would be implemented in the actual handler
      return deleteUser(input.userId);
    }),
});

export type AppRouter = typeof appRouter;

async function start() {
  const port = process.env['SERVER_PORT'] || 2022;
  
  const server = createHTTPServer({
    middleware: (req, res, next) => {
      cors({
        origin: process.env['FRONTEND_URL'] || 'http://localhost:3000',
        credentials: true
      })(req, res, next);
    },
    router: appRouter,
    createContext({ req }): Context {
      // Extract JWT token from Authorization header
      const token = req.headers.authorization?.replace('Bearer ', '');
      
      // In real implementation, verify token here and add user to context
      // For now, return empty context
      return {};
    },
  });

  server.listen(port);
  console.log(`🏥 Klinik Sehat Pata2 TRPC server listening at port: ${port}`);
  console.log(`📚 Environment: ${process.env['NODE_ENV'] || 'development'}`);
}

start();