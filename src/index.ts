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
	await mkdir(dest, { recursive: true });
	const subdirs = await getEntryFilenames(tarPath);
	const dir = subdirs.find((d) => (subdir ? d.includes(subdir) : false));
	extract(
		{
			file: tarPath.toString(),
			strip: subdir ? subdir.split("/").length : 1,
			C: dest,
		},
		dir ? [dir] : undefined
	);
};

const main = async () => {
	const thisDir = process.cwd();
	const tarPath = await downloadToFile({
		owner: "solidjs-community",
		name: "solid-cli",
	});
	const to = join(thisDir, "solid-cli");
	await extractFile(tarPath, to, "/packages");
};
main();
