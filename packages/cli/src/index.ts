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
import { getMostRecentCachedCommit } from "@begit/core";
import yoctoSpinner from "yocto-spinner";
import yoctoColors from "yoctocolors";

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
				description: "GitHub API Token",
			}),
			no_cache: flag({
				long: "no-cache",
				description: "Disables caching the downloaded tarball for the future",
			}),
		},
		async handler({ url, dest, subdir, token, no_cache }) {
			console.log(`Begit ${yoctoColors.bold(`v${version}`)}`);
			const parts = url.split("/");
			const source =
				parts
					.find((p) => p.includes(".com"))
					?.replace(".com", "")
					.toLowerCase() ?? "github";
			const fetcher = source ? matchFetcher(source) : undefined;
			if (!fetcher) {
				throw Error(`Source "${source}" isn't supported`);
			}
			if (parts.length === 0) {
				throw Error("Invalid URL");
			}
			const [repoName, branch] = parts.pop()!.split("#");
			const owner = parts.pop();
			if (!repoName || !owner) throw new Error("Invalid URL");
			let hash: string | undefined;
			const commitFetchSpinner = yoctoSpinner({
				text: "Fetching latest commit",
			}).start();
			try {
				hash = await fetcher.fetchLatestCommit(
					{ owner, name: repoName, branch },
					token,
				);
				commitFetchSpinner.success("Commit fetched!");
			} catch (e) {
				// Unable to fetch commit hash so use most recently cached value
				const cached = await getMostRecentCachedCommit(owner, repoName);
				if (!cached) {
					throw e;
					// throw new Error("Unable to fetch repository or retrieve from cache");
				}
				const x = new Date(cached.timestamp);
				hash = cached.hash;
				commitFetchSpinner.warning("Can't fetch repository from the internet");
				console.log(`Using cached repository from ${x.toUTCString()}`);
			}
			if (!hash) throw new Error("Unable to retrieve a valid commit hash");
			const downloadSpinner = yoctoSpinner({
				text: "Downloading repository...",
			}).start();
			try {
				await downloadRepo(
					{
						repo: { owner, name: repoName, branch, subdir, hash },
						dest,
						opts: { cache: !no_cache },
						auth_token: token,
					},
					fetcher,
				);
				downloadSpinner.success("Download complete!");
				const destination = dest ? dest : repoName;
				console.log(`Written to ${yoctoColors.bold(destination)}`);
			} catch (e) {
				downloadSpinner.error("Downloading repository failed :(");
				console.error(e);
			}
		},
	});
	const args = process.argv.slice(2);
	await run(cli, args);
};

main();
