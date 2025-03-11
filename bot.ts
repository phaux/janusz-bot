import { initTgBot } from "@smol/gram";

const botToken = Deno.env.get("TG_BOT_TOKEN");

if (!botToken) {
  throw new Error("Missing TG_BOT_TOKEN environment variable.");
}

export const bot = initTgBot({ botToken });

await bot.setMyName({ name: "Janusz" }).catch(() => {});

await bot.setMyCommands({
  commands: [{ command: "start", description: "Zapytaj wujka" }],
}).catch(() => {});

await bot.setMyDescription({
  description: "Pijany wujek z wesela, który odpowiada na pytania.",
}).catch(() => {});

await bot.setMyShortDescription({
  short_description: "Pijany wujek na weselu.",
}).catch(() => {});
