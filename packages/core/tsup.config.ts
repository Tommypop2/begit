import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts", "src/utils.ts"],
	target: "esnext",
	format: "esm",
	clean: true,
	splitting: true,
	sourcemap: true,
	treeshake: true,
	minify: false,
});
