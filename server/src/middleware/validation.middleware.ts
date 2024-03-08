import { NextFunction, Request, Response } from "express";
import { AnyZodObject, ZodError } from "zod";

export const validate =
  (schema: AnyZodObject) =>
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      return next();
    } catch (error) {
      if (error instanceof ZodError) {
        const zodError: ZodError = error;
        return res.status(400).json({
          message: "Validation failed",
          details: zodError.issues.map((issue) => {
            return {
              path: issue.path.join(": "),
              message: issue.message,
            };
          }),
        });
      }
      return res.status(400).json(error);
    }
  };
