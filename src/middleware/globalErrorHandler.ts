import { NextFunction, Request, Response } from "express";
import status from "http-status";

export const globalErrorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);

    res.status(status.INTERNAL_SERVER_ERROR).json(
        {
            success: false,
            statusCode: status.INTERNAL_SERVER_ERROR,
            message: err.message,
            error: err.stack
        }
    );

}