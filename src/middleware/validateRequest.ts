import { NextFunction, Request, Response } from 'express';
import { z } from 'zod';

const validateRequest = (schema: z.ZodTypeAny) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsedData = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      }) as any;

      if (parsedData.body !== undefined) req.body = parsedData.body;
      if (parsedData.query !== undefined) req.query = { ...req.query, ...parsedData.query };
      if (parsedData.params !== undefined) req.params = { ...req.params, ...parsedData.params };
      if (parsedData.cookies !== undefined) req.cookies = { ...req.cookies, ...parsedData.cookies };

      return next();
    } catch (error) {
      next(error);
    }
  };
};

export default validateRequest;
