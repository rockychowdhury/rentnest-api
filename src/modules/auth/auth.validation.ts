import { z } from 'zod';

const loginSchema = z.object({
  body: z.object({
    email: z.string().min(1, 'Email or Phone is required'),
    password: z.string().min(1, 'Password is required'),
  }),
});

const changePasswordSchema = z.object({
  body: z.object({
    oldPassword: z.string().min(1, 'Old password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
  }),
});

export const AuthValidation = {
  loginSchema,
  changePasswordSchema,
};
