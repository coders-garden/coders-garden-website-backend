import request from "supertest";
import app from "../app";
import { Member } from "../controllers/member";

describe("GET /", () => {
	it("should return a 200 response", async () => {
		const res = await request(app).get("/");
		expect(res.status).toBe(200);
	});

	it("should return a 'Hello World' message", async () => {
		const res = await request(app).get("/");
		expect(res.body.data).toBe("Hello World");
	});

	it("should return a 'Success' message", async () => {
		const res = await request(app).get("/");
		expect(res.body.message).toBe("Success");
	});
});

describe("GET /members", () => {
	it("should return a 200 response", async () => {
		const res = await request(app).get("/members");
		expect(res.status).toBe(200);
	});

	it("should return an array of objects", async () => {
		const res = await request(app).get("/members");
		expect(Array.isArray(res.body.data)).toBe(true);
		expect(typeof res.body.data[0]).toBe("object");
	});

	it("should return objects with the correct properties", async () => {
		const res = await request(app).get("/members");
		const member = res.body.data[0];
		expect(member).toHaveProperty("name");
		expect(member).toHaveProperty("username");
		expect(member).toHaveProperty("profile_pic_url");
		expect(member).toHaveProperty("followers");
		expect(member).toHaveProperty("following");
		expect(member).toHaveProperty("repositories");
		expect(member).toHaveProperty("bio");
		expect(member).toHaveProperty("github_link");
	});
});

describe("GET /member/PRATHAM1ST", () => {
	it("should return a 200 response", async () => {
		const res = await request(app).get("/member/PRATHAM1ST");
		expect(res.status).toBe(200);
	});

	it("should return an object", async () => {
		const res = await request(app).get("/member/PRATHAM1ST");
		expect(typeof res.body.data).toBe("object");
	});

	it("should return an object with the correct properties", async () => {
		const res = await request(app).get("/member/PRATHAM1ST");
		const member = res.body.data;
		expect(member).toHaveProperty("name");
		expect(member).toHaveProperty("username");
		expect(member).toHaveProperty("profile_pic_url");
		expect(member).toHaveProperty("followers");
		expect(member).toHaveProperty("following");
		expect(member).toHaveProperty("repositories");
		expect(member).toHaveProperty("bio");
		expect(member).toHaveProperty("github_link");
	});
});

describe("POST /graphql - List of Members", () => {
	it("should return a list of members with name and username", async () => {
		const query = `
			query {
				members {
					name
					username
				}
			}
		`;

		const res = await request(app)
			.post("/graphql")
			.send({ query })
			.expect(200);

		const { data, errors } = res.body;
		expect(errors).toBeUndefined(); // Check for GraphQL errors
		expect(data).toHaveProperty("members");
		expect(Array.isArray(data.members)).toBe(true);

		// Additional checks for each member object in the list
		data.members.forEach((member : Member) => {
			expect(member).toHaveProperty("name");
			expect(member).toHaveProperty("username");
		});
	});
});

describe("POST /graphql - Specific Member", () => {
	it("should return a specific member by login with name and username", async () => {
		const query = `
			query {
				member(login: "PRATHAM1ST") {
					name
					username
				}
			}
		`;

		const res = await request(app)
			.post("/graphql")
			.send({ query })
			.expect(200);

		const { data, errors } = res.body;
		expect(errors).toBeUndefined(); // Check for GraphQL errors
		expect(data).toHaveProperty("member");

		const member = data.member;
		expect(member).toHaveProperty("name");
		expect(member).toHaveProperty("username");
	});

	it("should return null for non-existent member", async () => {
		const query = `
			query {
				member(login: "NonExistentUser") {
					name
					username
				}
			}
		`;

		const res = await request(app)
			.post("/graphql")
			.send({ query })
			.expect(200);

		const { data, errors } = res.body;
		expect(errors).toBeUndefined(); // Check for GraphQL errors
		expect(data).toHaveProperty("member");
		expect(data.member).toBeNull(); // Expecting null for a non-existent member
	});
});
