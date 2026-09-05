// @ts-check
import { defineConfig } from "astro/config";

import cloudflare from "@astrojs/cloudflare";

const site = "https://mythcanvas.space";
const remoteBindings = process.env.MYTHCANVAS_REMOTE_DATA !== "false";

// https://astro.build/config
export default defineConfig({
	site,
	output: "server",
	i18n: {
		locales: ["zh-Hans", "en", "ja", "es", "zh-Hant", "fr", "de"],
		defaultLocale: "zh-Hans",
		routing: "manual",
	},
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
			remoteBindings,
		},
	}),
});
