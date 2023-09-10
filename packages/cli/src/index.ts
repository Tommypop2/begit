#! /usr/bin/env node
import { run, command, positional, string, optional, option } from "cmd-ts";
import updater from "tiny-updater";
import { name, version } from "../package.json";
import { downloadAndExtract } from "@begit/core";
const main = async () => {
	updater({ name, version, ttl: 86_400_000 });
	const cli = command({
		name: "begit",
		args: {
			url: positional({
				type: string,
				displayName: "URL",
				description: "The URL to clone",
			}),
			dest: positional({ type: optional(string), displayName: "Destination" }),
			subdir: option({
				type: string,
				long: "subdir",
				short: "s",
			}),
		},
		async handler({ url, dest, subdir }) {
			const parts = url.split("/");
			const repo = parts.pop();
			const owner = parts.pop();
			const branch = url.split("#")[1] as string | undefined;
			if (!repo || !owner) throw new Error("Invalid URL");
			await downloadAndExtract({
				repo: { owner, name: repo, branch, subdir },
				dest,
			});
		},
	});
	const args = process.argv.slice(2);
	await run(cli, args);
};

main();
