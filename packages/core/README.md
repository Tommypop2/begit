# Begit Core

![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/%40begit%2Fcore)

## Cloning to a directory

```ts
import { downloadRepo } from "@begit/core";
await downloadRepo({
 repo: {
  owner: "Tommypop2",
  name: "begit",
  branch: undefined,
  subdir: undefined,
 },
 dest: "cool_project",
});
```

The code above downloads this repository into a folder named `cool_project`.

Alternatively, `downloadAndExtract` could be used in place of `downloadRepo` to opt out of automatically attempting to handle errors

## Providing a custom commit hash

```ts
import { downloadRepo } from "@begit/core";

const custom_hash = "9e4e51beb1ac76e6c37be1757f14b904617a2f9b";

await downloadRepo({
 repo: {
  owner: "Tommypop2",
  name: "begit",
  branch: undefined,
  subdir: undefined,
  hash: custom_hash,
 },
 dest: "cool_project",
});
```

## Fetching the most recent cached commit

```ts
import { downloadRepo } from "@begit/core";

const most_recent_hash = await getMostRecentCachedCommit("Tommypop2", "begit"); // string | undefined

await downloadRepo({
 repo: {
  owner: "Tommypop2",
  name: "begit",
  branch: undefined,
  subdir: undefined,
  hash: most_recent_hash,
 },
 dest: "cool_project",
});
```

## Using a fetcher

```ts
import { downloadRepo, matchFetcher } from "@begit/core";
const fetcher = matchFetcher("github");

await downloadRepo({
 repo: {
  owner: "Tommypop2",
  name: "begit",
  branch: undefined,
  subdir: undefined,
  hash: most_recent_hash,
 },
 dest: "cool_project",
}, fetcher);
```
