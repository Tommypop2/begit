#! /usr/bin/env node
import {
	run,
	command,
	positional,
	string,
	optional,
	option,
	flag,
} from "cmd-ts";
import updater from "tiny-updater";
import { name, version } from "../package.json";
import { downloadRepo } from "@begit/core";
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
			dest: positional({
				type: optional(string),
				displayName: "Destination",
				description: "Folder to clone into",
			}),
			subdir: option({
				type: optional(string),
				long: "subdir",
				short: "s",
				description: "Subdirectory of repository to clone",
			}),
			no_cache: flag({
				long: "no-cache",
				description: "Disables caching the downloaded tarball for the future",
			}),
		},
		async handler({ url, dest, subdir, no_cache }) {
			const parts = url.split("/");
			const repo = parts.pop();
			const owner = parts.pop();
			const branch = url.split("#")[1] as string | undefined;
			if (!repo || !owner) throw new Error("Invalid URL");
			await downloadRepo({
				repo: { owner, name: repo, branch, subdir },
				dest,
				opts: { cache: !no_cache },
			});
		},
	});
	const args = process.argv.slice(2);
	await run(cli, args);
};

main();
