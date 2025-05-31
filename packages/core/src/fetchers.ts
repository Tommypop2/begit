import type { Repository } from ".";
import type { GitHubCommitData, Tarball } from "./utils";
export type FetcherSource = "github" | "gitlab";
export type Fetcher = {
	source: FetcherSource;

	fetchTarball: (
		repo: Repository,
		metadata?: { ref?: string; auth_token?: string },
	) => Promise<Tarball>;
	/**
	 * Fetches the most recent commit hash of a Github repository
	 *
	 * @param repo Repository to fetch latest commit of
	 * @param auth_token Optional parameter to authenticate Github API requests
	 * @returns Most recent commit hash in repository
	 */
	fetchLatestCommit: (repo: Repository, auth_token?: string) => Promise<string>;
};

export const GithubFetcher: Fetcher = {
	source: "github",
	async fetchTarball(repo, { ref, auth_token } = {}) {
		ref = ref ?? "HEAD";
		const auth = auth_token ?? process.env.BEGIT_GH_API_KEY;
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
		const auth = auth_token ?? process.env.BEGIT_GH_API_KEY;
		const res = await fetch(
			`https://api.github.com/repos/${repo.owner}/${repo.name}/commits?per_page=1${branch ? `&sha=${branch}` : ""}`,
			auth
				? {
					headers: { Authorization: `Bearer ${auth}` },
				}
				: undefined,
		);
		const json = (await res.json()) as GitHubCommitData[];
		return json[0].sha;
	},
};

export const GitlabFetcher: Fetcher = {
	source: "gitlab",
	async fetchTarball(repo, { ref, auth_token } = {}) {
		ref = ref ?? "HEAD";
		const auth = auth_token ?? process.env.BEGIT_GL_API_KEY;
		const res = await fetch(
			`https://gitlab.com/api/v4/projects/${repo.owner}%2F${repo.name}/repository/archive?sha=${ref}`,
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
		// HEAD should be the tip of the default branch.
		// On gitlab, this is better than just doing `/commits`, as passing a REF gives only a single commit which is less data
		const branch = repo.branch ?? "HEAD";
		const auth = auth_token ?? process.env.BEGIT_GH_API_KEY;
		const res = await fetch(
			`https://gitlab.com/api/v4/projects/${repo.owner}%2F${repo.name}/repository/commits?ref_name=${branch}`,
			auth
				? {
					headers: { Authorization: `Bearer ${auth}` },
				}
				: undefined,
		);
		const json = (await res.json()) as { id: string }[];
		return json[0].id;
	},
};

/**
 * Matches a string to its corresponding `Fetcher`
 *
 * Warning: Using this will include all available fetchers in your bundle.
 * Importing and using only the fetchers you need is recommended
 * @param maybe_source Git repository source
 * @returns A fetcher that can fetch from that source
 */
export const matchFetcher = (maybe_source: string): Fetcher | undefined => {
	switch (maybe_source) {
		case "github":
			return GithubFetcher;
		case "gitlab":
			return GitlabFetcher;
		default:
			return undefined;
	}
};
