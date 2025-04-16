import { describe, expect, test } from "vitest";
import { GithubFetcher, GitlabFetcher } from "../src/fetchers";
describe("GithubFetcher", () => {
	test("fetchTarball", async () => {
		const res = await GithubFetcher.fetchTarball({
			name: "solid-cli",
			owner: "solidjs-community",
		});
		expect(res.name).toBeTypeOf("string");
	});
	test("fetchLatestCommit", async () => {
		const res = await GithubFetcher.fetchLatestCommit({
			name: "solid-cli",
			owner: "solidjs-community",
			branch: "0.5.x"
		});
		expect(res).toBe("ffd59e711a0aa7ce8d9aa0f00dac895a535586ac");
	});
});

describe("GitlabFetcher", () => {
	test("fetchLatestCommit", async () => {
		const commit = await GitlabFetcher.fetchLatestCommit({
			name: "OpenRGB",
			owner: "CalcProgrammer1",
		})
		expect(commit.length).toBe(40);
	})
	test("fetchTarball", async () => {
		const res = await GitlabFetcher.fetchTarball({
			name: "OpenRGB",
			owner: "CalcProgrammer1",
		});
		expect(res.name).toBeTypeOf("string")
	})
})