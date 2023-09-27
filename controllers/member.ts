import { Request, Response } from "express";
import membersListLatest from "../data/members-list.json";
import ResponseHandler from "../components/responseHandler";
import axios, { AxiosResponse } from "axios";
import { parseHTML } from "linkedom";

interface Member {
	login: string;
	name: null | string;
	tfa_enabled: boolean;
	is_public: boolean;
	role: string | null;
	last_active: string | null;
	saml_name_id: null | string;
	username?: string;
	profile_pic_url?: null | string;
	followers?: null | string;
	following?: null | string;
	repositories?: null | string;
	bio?: null | string;
	github_link?: string;
}

const getUserProfileFromGithub = async (login: string) => {
	const response: AxiosResponse = await axios.get(
		`https://github.com/${login}`
	);

	if (response.status !== 200) {
		throw new Error("User not found");
	}

	return await response.data;
};

function extractSingleDataUsingSelector<
	T extends
		| keyof HTMLSpanElement
		| keyof HTMLAnchorElement
		| keyof HTMLDivElement
>(options: {
	html: Document;
	selector: string;
	error: string;
	attribute: T;
	defaultValue: string;
}): string {
	const element = options.html.querySelector<HTMLElement>(options.selector);
	if (!element) return "";

	return String(
		(element as Record<T, string>)[options.attribute] ??
			options.defaultValue
	);
}

function extractArrayOfDataUsingSelector<
	T extends keyof (HTMLSpanElement | HTMLAnchorElement | HTMLDivElement)
>(options: {
	html: Document;
	selector: string;
	error: string;
	attribute: T;
	defaultValue: string;
}): string[] {
	const elements: NodeListOf<HTMLElement> | null =
		options.html.querySelectorAll(options.selector);
	if (!elements) return [];

	const arrayOfElements: string[] = [];

	elements.forEach((element) => {
		arrayOfElements.push(
			String(element[options.attribute]) ?? options.defaultValue
		);
	});

	if (!arrayOfElements) return [];

	return arrayOfElements as string[];
}

const getUserInfo = async (html: string) => {
	const { document } = parseHTML(html);
	const photoSrc = extractSingleDataUsingSelector({
		html: document,
		selector:
			".js-profile-editable-replace > .clearfix.d-flex.d-md-block.flex-items-center.mb-4.mb-md-0 > .position-relative.d-inline-block.col-2.col-md-12.mr-3.mr-md-0.flex-shrink-0 > a",
		attribute: "href",
		error: "Photo not found",
		defaultValue: "",
	});

	const followersAndFollowing = extractArrayOfDataUsingSelector({
		html: document,
		selector:
			".js-profile-editable-area.d-flex.flex-column.d-md-block > div.flex-order-1.flex-md-order-none.mt-2.mt-md-0 > div > a > span",
		attribute: "innerText",
		error: "Followers and Following not found",
		defaultValue: "0",
	});

	const repositories = extractSingleDataUsingSelector({
		html: document,
		selector: ".Layout-main > div > nav > a > .Counter",
		attribute: "title",
		error: "Repositories not found",
		defaultValue: "0",
	});

	const bio = extractSingleDataUsingSelector({
		html: document,
		selector: "div[data-bio-text]",
		attribute: "innerText",
		error: "Bio not found",
		defaultValue: "",
	});

	if (!followersAndFollowing)
		console.log("Followers and Following not found");

	if (!photoSrc) console.log("Photo not found");

	if (!repositories) console.log("Repositories not found");

	return {
		/* eslint-disable camelcase */
		profile_pic_url: photoSrc,
		followers: followersAndFollowing[0],
		following: followersAndFollowing[1],
		repositories: repositories,
		bio: bio,
	};
};

export const updateSingleMember = async (member: Member) => {
	const html = await getUserProfileFromGithub(member.login);
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

	const member = membersListLatest.find(
		(member) => member.login === getGithubUserName
	);
	if (!member) throw new Error("Member not found");

	const updatedMember = await updateSingleMember(member);
	if (!updatedMember) throw new Error("Member not found");

	return ResponseHandler.success({
		req,
		res,
		data: updatedMember,
		message: "Member found",
	});
}

export async function GET(req: Request, res: Response) {
	const getGithubUserName = req.params.username;
	const member = membersListLatest.find(
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
