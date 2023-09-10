import { join } from "path";
import { cachedir, fetchLatestCommit, fetchTarball, toFile } from "./utils";
import { PathLike, existsSync } from "fs";
import { extract, list } from "tar";
import { mkdir } from "fs/promises";
export type Repository = {
	owner: string;
	name: string;
	branch?: string;
};
export type Installable = Repository & {
	subdir?: string;
};

type Options = {
	cache: boolean;
};
export const downloadToFile = async (
	repo: Repository,
	options: Options = { cache: true }
): Promise<PathLike> => {
	const { owner, name, branch } = repo;
	const hash = await fetchLatestCommit(owner, name);
	const location = join(cachedir(), `${owner}-${name}-${hash}.tar.gz`);
	if (existsSync(location)) return location;
	const tarball = await fetchTarball(owner, name, branch);
	await toFile(location, tarball);
	return location;
};
const getEntryFilenames = async (tarballFilename: any) => {
	const filenames: string[] = [];
	await list({
		file: tarballFilename,
		onentry: (entry) => filenames.push(entry.path),
	});
	return filenames;
};

export const extractFile = async (
	tarPath: PathLike,
	dest: string,
	subdir: string | null = null
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
	await new Promise<void>((res, rej) =>
		extract(
			{
				file: tarPath.toString(),
				strip,
				C: dest,
			},
			dir ? [dir] : undefined,
			(err) => {
				if (err) rej(err);
				res();
			}
		)
	);
};
type DownloadAndExtract = { repo: Installable; dest?: string; cwd?: string };
export const downloadAndExtract = async ({
	repo,
	dest,
	cwd,
}: DownloadAndExtract) => {
	cwd = cwd ?? process.cwd();
	dest = dest ?? repo.name;
	const tarPath = await downloadToFile(repo);
	await extractFile(tarPath, join(cwd, dest), repo.subdir);
};
