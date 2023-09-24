import { Request, Response } from "express";
import membersList from "../data/members-list-old.json";
import membersListLatest from "../data/members-list.json";
import ResponseHandler from "../components/responseHandler";
import { updateSingleMember } from "./member";

export async function PATCH(req: Request, res: Response) {
	const updateMembersListArray = await Promise.all(
		membersList.map((member) => updateSingleMember(member))
	);

	return ResponseHandler.success({
		req,
		res,
		data: updateMembersListArray,
		message: "Members list updated",
	});
}

export async function GET(req: Request, res: Response) {
	return ResponseHandler.success({
		req,
		res,
		data: membersListLatest,
		message: "Members list",
	});
}

export default { GET, PATCH };
