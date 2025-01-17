import { join } from "path";
import { cachedir, fetchLatestCommit, fetchTarball, toFile } from "./utils";
import { existsSync } from "fs";
import { extract } from "tar/extract";
import { list } from "tar/list";
import { mkdir, unlink } from "fs/promises";
export type Repository = {
	owner: string;
	name: string;
	branch?: string;
};
export type Installable = Repository & {
	subdir?: string;
};

export const downloadToFile = async (repo: Repository): Promise<string> => {
	const { owner, name, branch } = repo;
	// TODO: Fall back to most recently downloaded hash if this fails
	const hash = await fetchLatestCommit(owner, name);
	const location = join(cachedir(), `${owner}-${name}-${hash}.tar.gz`);
	if (existsSync(location)) return location;
	const tarball = await fetchTarball(owner, name, branch);
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
};
/**
 * Downloads given repository to a folder.
 */
export const downloadAndExtract = async ({
	repo,
	dest,
	cwd,
	opts = { cache: true },
}: DownloadAndExtract) => {
	const caching = opts.cache;
	cwd = cwd ?? process.cwd();
	dest = dest ?? repo.name;
	const tarPath = await downloadToFile(repo);
	await extractFile(tarPath, join(cwd, dest), repo.subdir);

	// Remove tarball download if not caching
	if (!caching) {
		await unlink(tarPath);
	}
};
/**
 * Wrapper around `downloadAndExtract`, which automatically attempts to re-download the tarball if extraction fails
 */
export const downloadRepo = async (opts: DownloadAndExtract) => {
	try {
		await downloadAndExtract(opts);
	} catch (e: any) {
		if (e.tarCode !== "TAR_ABORT") throw e;
		// Assume tarball is corrupted and attempt to refetch
		const tarPath = e.file as string;
		await unlink(tarPath);
		await downloadAndExtract(opts);
	}
};
