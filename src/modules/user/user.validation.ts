import { z } from 'zod';
import { UserRole, UserStatus, Gender } from '../../../generated/prisma/enums';

const createUserSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email format'),
    phone: z.string().min(1, 'Phone is required'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    fullName: z.string().min(1, 'Full name is required').max(255),
    role: z.enum([UserRole.TENANT, UserRole.LANDLORD]).optional(),
  }),
});

const updateMyAccountSchema = z.object({
  body: z.object({
    fullName: z.string().max(255).optional(),
    avatarUrl: z.string().url().optional(),
    bio: z.string().max(500).optional(),
    occupation: z.string().max(255).optional(),
    gender: z.nativeEnum(Gender).optional(),
  }).optional(),
});

const updateUserStatusSchema = z.object({
  params: z.object({
    userId: z.string().uuid("Invalid User ID in URL"),
  }),
  body: z.object({
    status: z.nativeEnum(UserStatus),
  }),
});

const restoreUserAccountSchema = z.object({
  body: z.object({
    email: z.string().email(),
  }),
});

const getUserByIdSchema = z.object({
  params: z.object({
    userId: z.string().uuid("Invalid User ID in URL"),
  }),
});

export const UserValidation = {
  createUserSchema,
  updateMyAccountSchema,
  updateUserStatusSchema,
  restoreUserAccountSchema,
  getUserByIdSchema,
};
