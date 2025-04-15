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
		expect(res).toBe("ffd59e711a0aa7ce8d9aa0f00dac895a535586ac");
	});
});
