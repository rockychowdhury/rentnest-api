import { z } from 'zod';
import { Gender } from '../../../generated/prisma/enums';
import { uuidParamSchema } from '../../middleware/shared.validation';

const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().max(255).optional(),
    avatarUrl: z.string().url().optional(),
    bio: z.string().max(500).optional(),
    occupation: z.string().max(255).optional(),
    gender: z.nativeEnum(Gender).optional(),
  }),
});

const getProfileByUserIdSchema = uuidParamSchema('userId');

export const ProfileValidation = {
  updateProfileSchema,
  getProfileByUserIdSchema,
};
