# Begit

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
