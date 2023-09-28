import {
	GraphQLSchema,
	GraphQLObjectType,
	GraphQLString,
	GraphQLList,
	GraphQLBoolean,
} from "graphql";
import membersListLatest from "../data/members-list.json";
import { Member } from "./member";

/* eslint-disable camelcase */

const MemberType = new GraphQLObjectType<Member>({
	name: "Member",
	fields: () => ({
		login: { type: GraphQLString },
		name: { type: GraphQLString },
		tfa_enabled: { type: GraphQLBoolean },
		is_public: { type: GraphQLBoolean },
		role: { type: GraphQLString },
		last_active: { type: GraphQLString },
		saml_name_id: { type: GraphQLString },
		username: { type: GraphQLString },
		profile_pic_url: { type: GraphQLString },
		followers: { type: GraphQLString },
		following: { type: GraphQLString },
		repositories: { type: GraphQLString },
		bio: { type: GraphQLString },
		github_link: { type: GraphQLString },
	}),
});

const QueryType = new GraphQLObjectType({
	name: "Query",
	fields: {
		members: {
			type: new GraphQLList(MemberType),
			resolve: () => membersListLatest,
		},
		member: {
			type: MemberType,
			args: {
				username: { type: GraphQLString },
			},
			resolve: (root, { username }) =>
				membersListLatest.find(
					(member) => member.username === username
				),
		},
	},
});

const schema = new GraphQLSchema({
	query: QueryType,
});

const root = {
	members: (): Member[] => {
		return membersListLatest;
	},
	member: ({ username }: { username: string }): Member | undefined => {
		return membersListLatest.find((member) => member.login === username);
	},
};

export default { root, schema };
