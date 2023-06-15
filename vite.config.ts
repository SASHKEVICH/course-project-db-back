import { defineConfig } from "vite";
import { configDefaults } from "vitest/config"

export default defineConfig({
	test: {
		exclude: [
			...configDefaults.exclude,
			'./src/database/db.ts'
		]
	},
});
