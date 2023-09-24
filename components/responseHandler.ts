import { Request, Response } from "express";

class ResponseHandler {
	static success(options: {
		req: Request;
		res: Response;
		data: string | object | null;
		message: string;
	}) {
		return options.res.status(200).json({
			status: true,
			data: options.data,
			message: options.message,
		});
	}

	static error(options: { req: Request; res: Response; message: string }) {
		return options.res.status(500).json({
			status: false,
			message: options.message,
		});
	}
}

export default ResponseHandler;
