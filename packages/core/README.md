# Begit

## Cloning to a directory

```ts
import { downloadAndExtract } from "@begit/core";
await downloadAndExtract({
	repo: {
		owner: "Tommypop2",
		name: "begit",
		branch: undefined,
		subdir: undefined,
	},
	"cool_project",
});
```
