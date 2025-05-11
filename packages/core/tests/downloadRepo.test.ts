import { mkdir, rm } from "fs/promises";
import { beforeAll, describe, expect, it, test } from "vitest";
import { downloadRepo } from "../src";
import { existsSync } from "fs";

describe("downloadRepo", () => {
	beforeAll(async () => {
		if (existsSync("./tmp_test")) await rm("./tmp_test", { recursive: true });
	});

	it("downloads repo to folder", async () => {
		await downloadRepo({
			repo: { owner: "Tommypop2", name: "begit" },
			dest: "./tmp_test/begit",
		});
		expect(
			existsSync("./tmp_test/begit/package.json") &&
			existsSync("./tmp_test/begit/packages/core/src/index.ts"),
		);
	});
});
