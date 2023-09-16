import { Request, Response } from "express";
import axios, { AxiosResponse } from "axios";
import { parseHTML } from "linkedom";
import membersList from "../data/members-list-old.json";
import membersListLatest from "../data/members-list.json";

interface Member {
	login: string;
	username?: string;
	name: null | string;
	tfa_enabled: boolean;
	is_public: boolean;
	role: string | null;
	last_active: string | null;
	saml_name_id: null | string;
	profile_pic_url?: null | string;
	followers?: null | string;
	following?: null | string;
	repositories?: null | string;
	bio?: null | string;
	github_link?: string;
}

const getUserProfile = async (login: string) => {
	const response: AxiosResponse = await axios.get(
		`https://github.com/${login}`
	);

	if (response.status !== 200) {
		throw new Error("User not found");
	}

	return await response.data;
};

const getUserInfo = async (html: string) => {
	const { document } = parseHTML(html);
	const photoSrc: HTMLAnchorElement | null = document.querySelector(
		".js-profile-editable-replace > .clearfix.d-flex.d-md-block.flex-items-center.mb-4.mb-md-0 > .position-relative.d-inline-block.col-2.col-md-12.mr-3.mr-md-0.flex-shrink-0 > a"
	);
	const followersAndFollowing: NodeListOf<HTMLSpanElement> | null =
		document.querySelectorAll(
			".js-profile-editable-area.d-flex.flex-column.d-md-block > div.flex-order-1.flex-md-order-none.mt-2.mt-md-0 > div > a > span"
		);

	const repositories: HTMLSpanElement | null = document.querySelector(
		".Layout-main > div > nav > a > .Counter"
	);

	const bio: HTMLDivElement | null =
		document.querySelector("div[data-bio-text]");

	if (!followersAndFollowing)
		console.log("Followers and Following not found");

	if (!photoSrc) console.log("Photo not found");

	if (!repositories) console.log("Repositories not found");

	return {
		profile_pic_url: photoSrc.href,
		followers: followersAndFollowing[0]
			? followersAndFollowing[0].innerText
			: "0",
		following: followersAndFollowing[1]
			? followersAndFollowing[1].innerText
			: "0",
		repositories: repositories.title,
		bio: bio.innerText ?? "",
	};
};

export async function PATCH(req: Request, res: Response) {
	try {
		const membersListArray: Member[] = membersList;

		for (let i = 0; i < membersList.length; i++) {
			const html = await getUserProfile(membersList[i].login);
			const { profile_pic_url, followers, following, repositories, bio } =
				await getUserInfo(html);
			membersListArray[i].username = membersListArray[i].login;
			membersListArray[
				i
			].github_link = `https://github.com/${membersListArray[i].login}`;
			membersListArray[i].profile_pic_url = profile_pic_url;
			membersListArray[i].followers = followers ?? "0";
			membersListArray[i].following = following ?? "0";
			membersListArray[i].repositories = repositories ?? "0";
			membersListArray[i].bio = bio ?? "";
		}

		return res.status(200).json({
			status: true,
			data: membersListArray,
			message: "Members list updated",
		});
	} catch (err) {
		return res.status(500).json({
			status: false,
			message: err.message,
		});
	}
}

export async function GET(req: Request, res: Response) {
	try {
		return res.status(200).json({
			status: true,
			data: membersListLatest,
			message: "Members list successfully retrieved",
		});
	} catch (err) {
		return res.status(500).json({
			status: false,
			message: err.message,
		});
	}
}

export default { GET, PATCH };
