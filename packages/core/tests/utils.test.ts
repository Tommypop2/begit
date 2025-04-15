import { describe, expect, test } from "vitest";
import { fetchLatestCommit, fetchTarball } from "../src/utils";
describe("utils", () => {
	test("fetchTarball", async () => {
		const res = await fetchTarball({
			name: "solid-cli",
			owner: "solidjs-community",
		});
		expect(res.name).toBeTypeOf("string");
	});
	test("fetchLatestCommit", async () => {
		const res = await fetchLatestCommit({
			name: "solid-cli",
			owner: "solidjs-community",
			branch: "0.5.x"
		});
		console.log(res)
		expect(res.length).toBe(40);
	});
});
