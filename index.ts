import express, { Express, Request, Response } from "express";
import membersRoute from "./routes/members";

const app: Express = express();

app.get("/", (req: Request, res: Response) => {
	return res.status(200).send({
		status: true,
		message: "Hello World",
	});
});

app.use("/members", membersRoute);

app.listen(3000, () => {
	console.log("Example app listening on port 3000!");
});
