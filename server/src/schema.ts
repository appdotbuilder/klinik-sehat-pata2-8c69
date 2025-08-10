import { z } from 'zod';

// User role enum schema
export const userRoleSchema = z.enum(['admin', 'doctor', 'cashier']);
export type UserRole = z.infer<typeof userRoleSchema>;

// User schema
export const userSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  password_hash: z.string(),
  role: userRoleSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type User = z.infer<typeof userSchema>;

// Input schema for user registration
export const registerUserInputSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  role: userRoleSchema
});

export type RegisterUserInput = z.infer<typeof registerUserInputSchema>;

// Input schema for user login
export const loginUserInputSchema = z.object({
  email: z.string().email('Invalid email format'),
  password: z.string().min(1, 'Password is required')
});

export type LoginUserInput = z.infer<typeof loginUserInputSchema>;

// Login response schema
export const loginResponseSchema = z.object({
  user: z.object({
    id: z.string().uuid(),
    name: z.string(),
    email: z.string().email(),
    role: userRoleSchema
  }),
  token: z.string()
});

export type LoginResponse = z.infer<typeof loginResponseSchema>;

// JWT payload schema
export const jwtPayloadSchema = z.object({
  userId: z.string().uuid(),
  email: z.string().email(),
  role: userRoleSchema,
  iat: z.number().optional(),
  exp: z.number().optional()
});

export type JwtPayload = z.infer<typeof jwtPayloadSchema>;

// Update user input schema
export const updateUserInputSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  email: z.string().email('Invalid email format').optional(),
  role: userRoleSchema.optional()
});

export type UpdateUserInput = z.infer<typeof updateUserInputSchema>;

// Change password input schema
export const changePasswordInputSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: z.string().min(8, 'New password must be at least 8 characters')
});

export type ChangePasswordInput = z.infer<typeof changePasswordInputSchema>;

// User profile response schema (without password_hash)
export const userProfileSchema = z.object({
  id: z.string().uuid(),
  name: z.string(),
  email: z.string().email(),
  role: userRoleSchema,
  created_at: z.coerce.date(),
  updated_at: z.coerce.date()
});

export type UserProfile = z.infer<typeof userProfileSchema>;