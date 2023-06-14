import app from "./app";
import request from "supertest";
import { assert, expect, test } from "vitest";

test("Test sample", () => {
	request(app)
		.get("/test")
		.expect(200)
		.then((response) => {
			assert(response.body.data, "test successfully");
		});
});
