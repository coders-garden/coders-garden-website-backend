import { buildSchema } from "graphql";
import membersListLatest from "../data/members-list.json";

interface Member {
	login: string;
	name: string | null;
	tfa_enabled: boolean;
	is_public: boolean;
	role: string | null;
	last_active: string | null;
	saml_name_id: string | null;
	username?: string;
	profile_pic_url?: string | null;
	followers?: string | null;
	following?: string | null;
	repositories?: string | null;
	bio?: string | null;
	github_link?: string;
}

const schema = buildSchema(`
    type Member {
        login: String!
        name: String
        tfa_enabled: Boolean!
        is_public: Boolean!
        role: String
        last_active: String
        saml_name_id: String
        username: String
        profile_pic_url: String
        followers: String
        following: String
        repositories: String
        bio: String
        github_link: String
    }

    type Query {
        members: [Member!]!
        member(login: String!): Member
    }
`);

const root = {
	members: (): Member[] => {
		return membersListLatest;
	},
	member: ({ login }: { login: string }): Member | undefined => {
		return membersListLatest.find((member) => member.login === login);
	},
};

export default { root, schema };
