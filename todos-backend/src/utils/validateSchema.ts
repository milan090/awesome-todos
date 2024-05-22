import { NextFunction, Request, Response } from "express";
import { ZodObject, z } from "zod";

const validateSchema = <T extends ZodObject<any>>(schema: T) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const validatedData = schema.safeParse(req.body);
    if (validatedData.success) {
      req.body = validatedData.data;
      return next();
    }
    return res
      .status(400)
      .json({ message: "Invalid data", error: validatedData.error });
  };
};

export default validateSchema;
