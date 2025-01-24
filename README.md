# Begit

![npm package minimized gzipped size](https://img.shields.io/bundlejs/size/%40begit%2Fcore)

A smaller and lighter degit alternative with Typescript support.

## Features

- Fast
  - Caches results by default so nothing is refetched unnecessarily
- Small
  - Only 24.9kB unpacked on [npm](https://www.npmjs.com/package/@begit/core?activeTab=readme) (22.1kB minified, bundled and gzipped with all dependencies)
- Fault-tolerant
  - Can recover from a corrupted cache file
- XDG Friendly
  - Respects [XDG directories](https://specifications.freedesktop.org/basedir-spec/basedir-spec-latest.html)
- Minimal Dependencies
  - Only has a single dependency ([tar](https://www.npmjs.com/package/tar)) for extracting the downloaded tarballs

## Begit CLI

A small CLI wrapper for `@begit/core`

## Installation

Run `npm i -g @begit/cli` to install. Invoke with `begit`

## Usage

For a comprehensive list of features, use the help command as below:

```bash
begit --help
```

Which will print something like:

```bash
begit

ARGUMENTS:
  <URL>         - The URL to clone
  [Destination] - a string [optional]

OPTIONS:
  --subdir, -s <str> - a string [optional]

FLAGS:
  --help, -h - show help
```

### Cloning a repositoy

To clone a repository to the current working directory, simply:

```bash
begit Tommypop2/begit
```

URLs are also accepted:

```bash
begit https://github.com/Tommypop2/begit
```

You can also specify the desired branch via a `#`:

```bash
begit Tommypop2/begit#main
```

### Cloning a subdirectory within a repo

Use any of the above options in conjunction with the `--subdir` flag.

```bash
begit Tommypop2/begit --subdir packages
```

Or, shortened to `-s`

```bash
begit Tommypop2/begit -s packages
```

## API Reference

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
 "cool_project",
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
 "cool_project",
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
 "cool_project",
});
```
