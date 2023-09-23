import { NextFunction, Request, Response } from "express";

function auth(req: Request, res: Response, next: NextFunction) {
	try {
		const token = req.header("Authorization");
		if (!token) throw Error("No token, authorization denied");

		const [user, password] = token?.split(" ");
		if (!user || !password) throw Error("No token, authorization denied");
		if (
			user !== process.env.USERNAME?.toLowerCase() ||
			password !== process.env.PASSWORD?.toLowerCase()
		)
			throw Error("Invalid token, authorization denied");

		next();
	} catch (err) {
		return res.status(500).json({
			status: false,
			message: err,
		});
	}
}

export default auth;
