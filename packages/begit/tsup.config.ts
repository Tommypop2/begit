import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	target: "esnext",
	format: "esm",
	// splitting: false,
	sourcemap: true,
	// minify: false,
	// bundle: true,
	clean: true,
	noExternal: ["@begit/cli"],
	// external: [/^(?!(@begit\/cli))/],
	treeshake: true,
});
