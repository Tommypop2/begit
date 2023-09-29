import { describe, expect, test } from "vitest";
import { fetchLatestCommit, fetchTarball } from "../src/utils";
describe("utils", () => {
	test("fetchTarball", async () => {
		const res = await fetchTarball("solidjs-community", "solid-cli");
		expect(res.name).toBeTypeOf("string");
	});
	test("fetchLatestCommit", async () => {
		const res = await fetchLatestCommit("solidjs-community", "solid-cli");
		expect(res.length).toBe(40);
	});
});
