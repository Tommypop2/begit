import { type PathLike, createWriteStream } from "fs";
import { mkdir } from "fs/promises";
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
export const fetchTarball = async (
	owner: string,
	repo: string,
	ref?: string,
): Promise<Tarball> => {
	ref = ref ?? "HEAD";
	const res = await fetch(`https://github.com/${owner}/${repo}/tarball/${ref}`);
	return {
		body: res.body as ReadableStream<Uint8Array>,
		name: res.url.split("/").pop()!,
	};
};
export const toFile = async (path: PathLike, tarball: Tarball) => {
	await mkdir(dirname(path.toString()), { recursive: true });
	const stream = createWriteStream(path);
	await finished(Readable.fromWeb(tarball.body).pipe(stream));
};
export type CommitData = {
	sha: string;
};
export const fetchLatestCommit = async (owner: string, repo: string) => {
	const auth = process.env["BEGIT_GH_API_KEY"]
	const res = await fetch(
		`https://api.github.com/repos/${owner}/${repo}/commits?per_page=1`, auth ? {
			headers: { "Authorization": `Bearer ${auth}` }
		} : undefined
	);
	const json = (await res.json()) as CommitData[];
	return json[0].sha;
};
