import { Repository } from "."
import type { GitHubCommitData, Tarball } from "./utils"
export type FetcherSource = "github" | "gitlab"
export type Fetcher = {
	source: FetcherSource,
	fetchTarball: (repo: Repository, metadata: { ref?: string; auth_token?: string }) => Promise<Tarball>
	fetchLatestCommit: (repo: Repository, auth_token?: string) => Promise<string>
}

export const GithubFetcher: Fetcher = {
	source: "github",
	async fetchTarball(repo, { ref, auth_token } = {}) {
		ref = ref ?? "HEAD";
		const auth = auth_token ?? process.env["BEGIT_GH_API_KEY"];
		const res = await fetch(
			`https://api.github.com/repos/${repo.owner}/${repo.name}/tarball/${ref}`,
			auth
				? {
					headers: { Authorization: `Bearer ${auth}` },
				}
				: undefined,
		);
		return {
			body: res.body as ReadableStream<Uint8Array>,
			name: res.url.split("/").pop()!,
		} as Tarball;
	},
	async fetchLatestCommit(repo, auth_token) {
		const branch = repo.branch;
		const auth = auth_token ?? process.env["BEGIT_GH_API_KEY"];
		const res = await fetch(
			`https://api.github.com/repos/${repo.owner}/${repo.name}/commits?per_page=1` + (branch ? `&sha=${branch}` : ""),
			auth
				? {
					headers: { Authorization: `Bearer ${auth}` },
				}
				: undefined,
		);
		const json = (await res.json()) as GitHubCommitData[];
		return json[0].sha;
	},
}

export const GitlabFetcher: Fetcher = {
	source: "gitlab",
	async fetchTarball(repo, metadata) {
		const ref = metadata.ref ?? "HEAD";
		const auth = metadata.auth_token ?? process.env["BEGIT_GL_API_KEY"];
		const res = await fetch(
			`https://gitlab.com/api/v4/projects/${repo.owner}%2F${repo.name}/repository/archive`,
			auth
				? {
					headers: { Authorization: `Bearer ${auth}` },
				}
				: undefined,
		);
		return {
			body: res.body as ReadableStream<Uint8Array>,
			name: res.url.split("/").pop()!,
		} as Tarball;
	},
	async fetchLatestCommit(repo, auth_token) {
		const auth = auth_token ?? process.env["BEGIT_GH_API_KEY"];
		const res = await fetch(
			`https://gitlab.com/api/v4/projects/${repo.owner}%2F${repo.name}/repository/commits`,
			auth
				? {
					headers: { Authorization: `Bearer ${auth}` },
				}
				: undefined,
		);
		const json = (await res.json()) as { id: string }[];
		return json[0].id;
	},
}