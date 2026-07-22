import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts"],
	target: "esnext",
	format: "esm",
	// splitting: false,
	sourcemap: true,
	// minify: false,
	// bundle: true,
	clean: true,
	// external: [/^(?!(@begit\/cli))/],
	treeshake: true,
  deps: {
    alwaysBundle: ["@begit/cli"],
  },
  dts: false,
});
