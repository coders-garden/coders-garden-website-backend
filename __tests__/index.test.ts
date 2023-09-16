import request from "supertest";
import app from "../index";

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
		expect(member).toHaveProperty("profile_url");
		expect(member).toHaveProperty("followers");
		expect(member).toHaveProperty("repositories");
		expect(member).toHaveProperty("bio");
	});
});
