import { NextFunction, Request, Response } from "express";
import ResponseHandler from "./responseHandler";

const errorHandler = (fn: (req: Request, res: Response, next?: NextFunction) => Promise<Response<any, Record<string, any>>>) =>
    function (req: Request, res: Response, next: NextFunction) {
        Promise.resolve(fn(req, res, next)).catch((err: Error) => {
            return ResponseHandler.error({
                req,
                res,
                message: err.message,
            });
        });
    };

export default errorHandler;