import { Request, Response } from "express";
import membersListLatest from "../data/members-list.json";
import ResponseHandler from "../components/responseHandler";
import axios, { AxiosResponse } from "axios";
import { parseHTML } from "linkedom";

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
		profile_pic_url: photoSrc?.href,
		followers: followersAndFollowing[0]
			? followersAndFollowing[0].innerText
			: "0",
		following: followersAndFollowing[1]
			? followersAndFollowing[1].innerText
			: "0",
		repositories: repositories?.title,
		bio: bio?.innerText ?? "",
	};
};

const updateSingleMember = async (member: Member) => {
	const html = await getUserProfile(member.login);
	const { profile_pic_url, followers, following, repositories, bio } =
		await getUserInfo(html);
	member.username = member.login;
	member.github_link = `https://github.com/${member.login}`;
	member.profile_pic_url = profile_pic_url;
	member.followers = followers ?? "0";
	member.following = following ?? "0";
	member.repositories = repositories ?? "0";
	member.bio = bio ?? "";

    return member; 
};

export async function PATCH(req: Request, res: Response) {
	const getGithubUserName = req.params.username;

	const member = membersListLatest.find((member) => member.login === getGithubUserName);
	if (!member) throw new Error("Member not found");

	const updatedMember = await updateSingleMember(member);
	if (!updatedMember) throw new Error("Member not found");

    console.log('updatedMember', updatedMember);

	return ResponseHandler.success({
		req,
		res,
		data: updatedMember,
		message: "Member found",
	});
}

export async function GET(req: Request, res: Response) {
	const getGithubUserName = req.params.username;
	const membersListArray: Member[] = membersListLatest;
	const member = membersListArray.find(
		(member) => member.login === getGithubUserName
	);

	if (!member) throw new Error("Member not found");

	return ResponseHandler.success({
		req,
		res,
		data: member,
		message: "Member found",
	});
}

export default { GET, PATCH };
