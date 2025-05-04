import { join } from "path";
import {
	cachedir,
	cacheFileName,
	getFileWithHash,
	toFile,
} from "./utils";
import { extract } from "tar/extract";
import { list } from "tar/list";
import { mkdir, unlink } from "fs/promises";
import { Fetcher, GithubFetcher } from "./fetchers";
export * from "./utils";
export * from "./fetchers";
export type Repository = {
	owner: string;
	name: string;
	branch?: string;
	hash?: string;
};
export type Installable = Repository & {
	subdir?: string;
};
/**
 * Downloads the given repository to a tarball on the user's machine
 *
 * @param repo The repository to download
 * @param auth_token (optional) Github auth token for fetching
 */
export const downloadToFile = async (
	fetcher: Fetcher,
	repo: Repository,
	auth_token?: string,
): Promise<string> => {
	const { owner, name } = repo;
	let hash = repo.hash;
	if (!hash) {
		hash = await fetcher.fetchLatestCommit(repo, auth_token);
	}
	// Check if we have already cached the desired repo and hash
	const cached = await getFileWithHash(owner, name, hash);
	if (cached) return join(cachedir(), cached);
	// Download tarball and timestamp filename
	const location = join(
		cachedir(),
		cacheFileName(owner, name, hash, Date.now()),
	);
	const tarball = await fetcher.fetchTarball(repo, { ref: hash, auth_token });
	await toFile(location, tarball);
	return location;
};
/**
 * @param {string} tarballFilename
 * @returns A list of all the files in the tarball
 */
const getEntryFilenames = async (tarballFilename: string) => {
	const filenames: string[] = [];
	await list({
		file: tarballFilename,
		onentry: (entry) => filenames.push(entry.path),
	});
	return filenames;
};
/**
 * Extracts a tarball to a given path
 * @param tarPath Path to the tarfile to be extracted
 * @param dest Destination folder, into which the contents of the tarball will be extracted
 * @param subdir Folder within the tarball to extract
 * @param overwrite Whether or not to overwrite existing files in the target directory
 */
export const extractFile = async (
	tarPath: string,
	dest: string,
	subdir: string | null = null,
	overwrite = false,
) => {
	if (subdir) {
		subdir = subdir?.startsWith("/") ? subdir : `/${subdir}`;
		subdir = subdir?.endsWith("/") ? subdir : `${subdir}/`;
	}
	await mkdir(dest, { recursive: true });
	const subdirs = await getEntryFilenames(tarPath);
	const dir = subdirs.find((d) => (subdir ? d.includes(subdir) : false));
	if (subdir && !dir) throw new Error("Subdirectory not found");
	const strip = dir ? dir.split("/").length - 1 : 1;
	await extract(
		{
			// @ts-expect-error
			file: tarPath.toString(),
			strip,
			C: dest,
			k: !overwrite,
		},
		dir ? [dir] : undefined,
	);
};
export type DownloadAndExtractOptions = {
	cache: boolean;
};
export type DownloadAndExtract = {
	repo: Installable;
	dest?: string;
	cwd?: string;
	opts?: DownloadAndExtractOptions;
	auth_token?: string;
};
/**
 * Downloads given repository to a folder.
 */
export const downloadAndExtract = async ({
	repo,
	dest,
	cwd,
	auth_token,
	opts = { cache: true },
}: DownloadAndExtract, fetcher: Fetcher = GithubFetcher) => {
	const caching = opts.cache;
	cwd = cwd ?? process.cwd();
	dest = dest ?? repo.name;
	const tarPath = await downloadToFile(fetcher, repo, auth_token);
	await extractFile(tarPath, join(cwd, dest), repo.subdir);

	// Remove tarball download if not caching
	if (!caching) {
		await unlink(tarPath);
	}
};
/**
 * Wrapper around `downloadAndExtract`, which automatically attempts to re-download the tarball if extraction fails
 */
export const downloadRepo = async (opts: DownloadAndExtract, fetcher?: Fetcher) => {
	// Attempt refetching
	let retries = 2;
	try {
		await downloadAndExtract(opts, fetcher);
	} catch (e: any) {
		if (e.tarCode !== "TAR_ABORT" || --retries === 0) throw e;
		// Assume tarball is corrupted and attempt to refetch
		const tarPath = e.file as string;
		await unlink(tarPath);
		await downloadAndExtract(opts, fetcher);
	}
};
