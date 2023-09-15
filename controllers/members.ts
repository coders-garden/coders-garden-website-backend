import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import { parseHTML } from "linkedom";
import membersList from "../data/members-list.json";

interface Member {
	login: string;
	name: null | string;
	tfa_enabled: boolean;
	is_public: boolean;
	role: string | null;
	last_active: string | null;
	saml_name_id: null | string;
	photo: null | string;
}

const getUserProfile = async (login: string) => {
	const response: AxiosResponse = await axios.get(
		`https://github.com/${login}`
	);

	if (response.status !== 200) {
		throw new Error("User not found");
	}

	return await response.data.text();
};

const getPhotoSrc = async (html: string) => {
	const { document } = parseHTML(html);
	const photoSrc: HTMLAnchorElement | null = document.querySelector(
		"div.position-relative.d-inline-block.col-2.col-md-12.mr-3.mr-md-0.flex-shrink-0 > a"
	);

	if (!photoSrc) throw new Error("Photo not found");

	return photoSrc.href;
};

export async function PATCH(req: Request, res: Response) {
	const membersListArray: Member[] = membersList;

	for (let i = 0; i < membersList.length; i++) {
		const html = await getUserProfile(membersList[i].login);
		const photoSrc = await getPhotoSrc(html);
		membersListArray[i].photo = photoSrc;
	}

	return res.json(membersListArray);
}

export async function GET(req: Request, res: Response) {
	return res.json(membersList);
}

export default { GET, PATCH };
