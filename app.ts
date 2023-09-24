require("dotenv").config();
import express, { Express, Request, Response } from "express";
import membersRoute from "./routes/members";
import cors from "cors";
import morgan from "morgan";
import ResponseHandler from "./components/responseHandler";

const corsOptions = {
	origin: "*",
};

cors(corsOptions);

const app: Express = express();

app.use(cors());
app.use(morgan("dev"));

app.get("/", (req: Request, res: Response) => {
	return ResponseHandler.success({
		req,
		res,
		data: "Hello World",
		message: "Success",
	});
});

app.use("/members", membersRoute);

export default app;
