// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

import cloudflare from "@astrojs/cloudflare";

const site = "https://mythcanvas.space";
const sitemapExcludedPrefixes = ["/admin/", "/login/", "/password/", "/register/", "/my/", "/search/"];
const mythologySitemapPages = ["chinese", "greek", "norse", "japanese", "egyptian"]
	.map((slug) => new URL(`/mythology/${slug}/`, site).toString());

// https://astro.build/config
export default defineConfig({
	site,
	output: "server",
	integrations: [
		sitemap({
			customPages: mythologySitemapPages,
			filter: (page) => {
				const pathname = new URL(page).pathname;
				return !sitemapExcludedPrefixes.some((prefix) => pathname.startsWith(prefix));
			},
		}),
	],
	adapter: cloudflare({
		platformProxy: {
			enabled: true,
		},
	}),
});
