import { Message } from "ollama";
import { bot } from "./bot.ts";
import ollama from "ollama";

const initialMessage: Message = {
  role: "system",
  content: "Nazywasz się Janusz i jesteś pijanym wujkiem na weselu. " +
    "Odpowiadaj próbując żartować w obrzydliwy sposób i wychwalaj partię PiS. " +
    "Używasz komunikatora internetowego Telegram. " +
    "Wstawiaj często emoji i odpowiadaj krótko. " +
    "Nie pisz długich akapitów.",
};

export async function generateResponse(
  chatId: number,
  replyToMessageId: number | undefined,
  chatMessages: Message[],
) {
  for (const m of chatMessages) {
    if (m.role !== "system") {
      console.log(m.role, ":", m.content);
    }
  }

  if (replyToMessageId != null) {
    await bot
      .setMessageReaction({
        chat_id: chatId,
        message_id: replyToMessageId,
        reaction: [{ type: "emoji", emoji: "👀" }],
      })
      .catch(() => {});
  }

  let responseText = "";
  let i = 0;
  let lastMessageId = replyToMessageId;

  try {
    const stream = await ollama.chat({
      model: "SpeakLeash/bielik-11b-v2.3-instruct:Q4_K_M",
      options: { temperature: 1 },
      messages: [initialMessage, ...chatMessages],
      stream: true,
    });

    for await (const chunk of stream) {
      if (chunk.message.role === "assistant") {
        responseText += chunk.message.content;
      }

      const newLineIdx = responseText.indexOf("\n");
      if (newLineIdx !== -1) {
        const newMessageText = responseText.substring(0, newLineIdx);
        if (newMessageText.trim().length > 0) {
          console.log("assistant", ":", newMessageText);
          const newMessage = await bot.sendMessage({
            chat_id: chatId,
            reply_parameters: lastMessageId != null ? { message_id: lastMessageId } : undefined,
            text: responseText.substring(0, newLineIdx),
          });
          lastMessageId = newMessage.message_id;
          i = 0;
        }
        responseText = responseText.substring(newLineIdx + 1);
      }

      if (i % 10 === 0) {
        await bot
          .sendChatAction({
            chat_id: chatId,
            action: "typing",
          })
          .catch(() => {});
      }

      i += 1;
    }
  } finally {
    if (replyToMessageId) {
      await bot
        .setMessageReaction({
          chat_id: chatId,
          message_id: replyToMessageId,
          reaction: [],
        })
        .catch(() => {});
    }
  }

  console.log("assistant", ":", responseText);
  await bot.sendMessage({
    chat_id: chatId,
    reply_parameters: lastMessageId ? { message_id: lastMessageId } : undefined,
    text: responseText,
  });
}
