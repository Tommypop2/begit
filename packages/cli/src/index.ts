#! /usr/bin/env node
import { run, command, positional, string } from "cmd-ts";
import updater from "tiny-updater";
import { name, version } from "../package.json";

const main = async () => {
	updater({ name, version, ttl: 86_400_000 });
	const cli = command({
		name: "begit",
		args: {
			url: positional({
				type: string,
				displayName: "url",
				description: "The URL to clone",
			}),
		},
		handler({ url }) {
			console.log(url);
		},
	});
	const args = process.argv.slice(2);
	await run(cli, args);
};

main();
