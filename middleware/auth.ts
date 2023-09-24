import { NextFunction, Request, Response } from "express";
import ResponseHandler from "../components/responseHandler";

function auth(req: Request, res: Response, next: NextFunction) {
	try {
		const token = req.header("Authorization");
		if (!token) throw Error("No token, authorization denied");

		const [user, password] = token.split(" ");
		if (!user || !password) throw Error("No token, authorization denied");
		if (
			user !== process.env.USERNAME?.toLowerCase() ||
			password !== process.env.PASSWORD?.toLowerCase()
		)
			throw Error("Invalid credentials");

		next();
	} catch (err: any) { // eslint-disable-line
		return ResponseHandler.error({
			req,
			res,
			message: err.message,
		});
	}
}

export default auth;
