import { type PathLike, createWriteStream } from "fs";
import { mkdir, readdir } from "fs/promises";
import { Readable } from "stream";
import type { ReadableStream } from "stream/web";
import { finished } from "stream/promises";
import { homedir as oshomedir, tmpdir as ostmpdir } from "os";
import { dirname, join } from "path";

export const homedir = () => {
	return process.env.XDG_CONFIG_HOME ?? oshomedir();
};
export const begitDir = () => {
	const dir = process.env.XDG_CACHE_HOME ?? ostmpdir();
	return join(dir, ".begit");
};
export const cachedir = () => {
	return join(begitDir(), "cache");
};
export type Tarball = {
	name: string;
	body: ReadableStream<Uint8Array>;
};

export const toFile = async (path: PathLike, tarball: Tarball) => {
	await mkdir(dirname(path.toString()), { recursive: true });
	const stream = createWriteStream(path);
	await finished(Readable.fromWeb(tarball.body).pipe(stream));
};
export const cacheFileName = (
	owner: string,
	name: string,
	hash: string,
	timestamp: number,
) => `${owner}-${name}-${hash}-${timestamp}.tar.gz`;
export type GitHubCommitData = {
	sha: string;
};

export const getFileWithHash = async (
	repoOwner: string,
	repoName: string,
	hash: string,
) => {
	const dir = cachedir();
	await mkdir(dir, { recursive: true });
	const files = await readdir(dir);
	const fileName = files.filter((name) =>
		name.startsWith(`${repoOwner}-${repoName}-${hash}`),
	)[0];
	return fileName;
};
/**
 * Gets the most recent commit hash of the repository from the local cache
 *
 * @param repoOwner Owner of repository
 * @param repoName Repository name
 * @returns Most recent commit hash of repository in cache, or `undefined`
 * if there is no cache entry for this repository
 */
export const getMostRecentCachedCommit = async (
	repoOwner: string,
	repoName: string,
): Promise<{ hash: string; timestamp: number } | undefined> => {
	const dir = cachedir();
	await mkdir(dir, { recursive: true });
	const files = (await readdir(dir)).map((x) => x.replace(".tar.gz", ""));
	let file_with_max_stamp: { hash: string; timestamp: number } | undefined;
	for (const file of files) {
		const split = file.split("-");
		const [owner, name, hash] = split;
		const timestamp = parseInt(split[3]);
		if (owner == repoOwner && name == repoName) {
			// Right repository, so check if timestamp is more recent
			if (!file_with_max_stamp || timestamp > file_with_max_stamp.timestamp)
				file_with_max_stamp = { hash: hash, timestamp };
		}
	}
	return file_with_max_stamp;
};
