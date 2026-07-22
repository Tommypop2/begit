import { defineConfig } from "tsdown";

export default defineConfig({
	entry: ["src/index.ts", "src/utils.ts"],
	target: "esnext",
	format: "esm",
	clean: true,
	sourcemap: true,
	treeshake: true,
	minify: false,
	dts: false,
});
