import { readFile, writeFile } from "fs/promises";
(async () => {
	const template = await readFile("README.template.md", "utf-8");
	const cliREADME = await readFile("packages/cli/README.md", "utf-8");
	const coreREADME = await readFile("packages/core/README.md", "utf-8");

	const generated = template
		.replace("{{cli}}", cliREADME.split("\n").slice(1).join("\n"))
		.replace("{{core}}", coreREADME.split("\n").slice(1).join("\n"));

	await writeFile("README.md", generated, "utf-8");
})();
