import { dirname, join } from "path";
import { cachedir, fetchLatestCommit, fetchTarball, toFile } from "./utils";
import { PathLike, createReadStream, createWriteStream, existsSync } from "fs";
import { extract } from "tar";
import { mkdir } from "fs/promises";
export type Repository = {
	owner: string;
	name: string;
	branch?: string;
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
export const extractFile = async (tarPath: PathLike, path: string) => {
	await mkdir(path, { recursive: true });
	createReadStream(tarPath).pipe(extract({ strip: 1, cwd: path }));
};

const main = async () => {
	const thisDir = process.cwd();
	const tarPath = await downloadToFile({
		owner: "solidjs-community",
		name: "solid-cli",
	});
	const to = join(thisDir, "solid-cli");
	await extractFile(tarPath, to);
};
main();
