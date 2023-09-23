import { Request, Response } from "express";

class ResponseHandler {
	static success(req: Request, res: Response, data: any, message: string) {
		return res.status(200).json({
			status: true,
			data,
			message,
		});
	}

	static error(req: Request, res: Response, message: string) {
		return res.status(500).json({
			status: false,
			message,
		});
	}
}

export default ResponseHandler;