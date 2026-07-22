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

			hash = await fetcher.fetchLatestCommit(
				{ owner, name: repoName, branch },
				token,
			);
			if (hash) commitFetchSpinner.success("Commit fetched!");
			else commitFetchSpinner.warning("Unable to fetch latest commit");
			const mostRecentCachedCommitSpinner = yoctoSpinner({
				text: "Fetching latest cached commit",
			}).start();
			// Unable to fetch commit hash so use most recently cached value
			let cached = await getMostRecentCachedCommit(owner, repoName);
			if (cached) {
				const x = new Date(cached.timestamp);
				hash = cached.hash;
				mostRecentCachedCommitSpinner.success(
					`Using cached repository from ${x.toUTCString()}`,
				);
			} else {
				mostRecentCachedCommitSpinner.warning(
					`Unable to find cached commit, attempting download from ${hash?.slice(0, 6) || "HEAD"}`,
				);
			}

			const downloadSpinner = yoctoSpinner({
				text: "Downloading repository...",
			}).start();
			try {
				const args = {
					repo: { owner, name: repoName, branch, subdir, hash },
					dest,
					opts: { cache: !no_cache },
					auth_token: token,
				};
				await downloadRepo(args, fetcher);
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
