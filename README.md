# Begit

A smaller and lighter degit alternative with typescript support.

## Features

- Fast
  - Caches results by default so nothing is refetched unnecessarily
- Small
  - Only 13.1kB unpacked on [npm](https://www.npmjs.com/package/@begit/core?activeTab=readme) (actual source code is more like 1.4kB minified)
- Fault-tolerant
  - Can recover from a corrupted cache file
- XDG Friendly
  - Respects XDG directories

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
