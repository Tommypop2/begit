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
import { downloadRepo, matchFetcher } from "@begit/core";
import {
	getMostRecentCachedCommit,
} from "@begit/core";
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
			token: option({
				type: optional(string),
				long: "token",
				short: "t",
				description: "GitHub API Token"
			}),
			no_cache: flag({
				long: "no-cache",
				description: "Disables caching the downloaded tarball for the future",
			}),
		},
		async handler({ url, dest, subdir, token, no_cache }) {
			const parts = url.split("/");
			const source = parts.find(p => p.includes(".com"))?.replace(".com", "").toLowerCase() ?? "github";
			const fetcher = source ? matchFetcher(source) : undefined;
			if (!fetcher) {
				throw Error(`Source "${source}" isn't supported`)
			}
			if (parts.length == 0) {
				throw Error("Invalid URL")
			}
			const [repoName, branch] = parts.pop()!.split("#");
			const owner = parts.pop();
			if (!repoName || !owner) throw new Error("Invalid URL");
			let hash: string | undefined;
			try {
				hash = await fetcher.fetchLatestCommit({ owner, name: repoName, branch }, token);
			} catch (_) {
				// Unable to fetch commit hash so use most recently cached value
				const cached = await getMostRecentCachedCommit(owner, repoName);
				if (!cached) {
					throw new Error("Unable to fetch repository or retrieve from cache");
				}
				const x = new Date(cached.timestamp);
				console.log("Can't fetch repository from the internet");
				console.log(`Using cached repository from ${x.toUTCString()}`);
				hash = cached.hash;
			}
			if (!hash) throw new Error("Unable to retrieve a valid commit hash");
			await downloadRepo(fetcher, {
				repo: { owner, name: repoName, branch, subdir, hash },
				dest,
				opts: { cache: !no_cache },
				auth_token: token,
			});
		},
	});
	const args = process.argv.slice(2);
	await run(cli, args);
};

main();
