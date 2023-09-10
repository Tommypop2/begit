import { defineConfig } from "tsup";

export default defineConfig({
	entry: ["src/index.ts"],
	target: "esnext",
	format: "esm",
	splitting: false,
	sourcemap: false,
	minify: true,
	bundle: true,
	clean: true,
	noExternal: [/.*/],
	treeshake: true,
});
