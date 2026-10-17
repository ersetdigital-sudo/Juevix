import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

/** Crawler AI yang kita izinkan (membantu brand muncul di jawaban AI). */
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "Google-Extended",
  "Applebot-Extended",
  "Amazonbot",
  "Bingbot",
  "meta-externalagent",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/bayar"],
      },
      ...AI_CRAWLERS.map((userAgent) => ({
        userAgent,
        allow: "/",
        disallow: ["/bayar"],
      })),
    ],
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
