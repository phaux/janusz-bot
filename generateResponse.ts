import { ChatResponse, Message } from "ollama";
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
    // React to currently handled message.
    await bot
      .setMessageReaction({
        chat_id: chatId,
        message_id: replyToMessageId,
        reaction: [{ type: "emoji", emoji: "👀" }],
      })
      .catch(() => {});
  }

  let lastMessageId = replyToMessageId;

  try {
    const stream = await ollama.chat({
      model: "SpeakLeash/bielik-11b-v2.3-instruct:Q4_K_M",
      options: { temperature: 1 },
      messages: [initialMessage, ...chatMessages],
      stream: true,
    });
    for await (const responseText of getAssistantMessages(stream)) {
      if (!responseText) {
        // Turn empty messages into typing actions.
        await bot.sendChatAction({ chat_id: chatId, action: "typing" }).catch(() => {});
        continue;
      }
      console.log("assistant", ":", responseText);
      const newMessage = await bot.sendMessage({
        chat_id: chatId,
        reply_parameters: lastMessageId != null ? { message_id: lastMessageId } : undefined,
        text: responseText
          // Telegram API requires escaping of some characters in MarkdownV2 mode.
          .replace(/[-!#.()]/g, (s) => `\\${s}`),
        parse_mode: "MarkdownV2",
      });
      lastMessageId = newMessage.message_id;
    }
  } finally {
    if (replyToMessageId) {
      // Remove reaction from currently handled message.
      await bot
        .setMessageReaction({
          chat_id: chatId,
          message_id: replyToMessageId,
          reaction: [],
        })
        .catch(() => {});
    }
  }
}

/**
 * Takes Ollama response stream and turns it into an iterable of paragraphs to send as messages.
 * Also yields null every short interval so you can send typing indicators.
 */
const getAssistantMessages = (responseStream: AsyncIterable<ChatResponse>) =>
  intersperseNulls(splitParagraphs(getAssistantText(responseStream)), 3000);

/** Takes Ollama response stream and returns iterable of response text chunks. */
async function* getAssistantText(responseStream: AsyncIterable<ChatResponse>) {
  for await (const chunk of responseStream) {
    if (chunk.message.role === "assistant") {
      yield chunk.message.content;
    }
  }
}

/** Takes iterable of string chunks and returns iterable of markdown paragraphs. */
async function* splitParagraphs(strings: AsyncIterable<string>) {
  let buffer: string[] = [];
  let insideCode = false;
  for await (const line of splitLines(strings)) {
    if (line.startsWith("```")) {
      insideCode = !insideCode;
    }
    if (line.trim().length === 0 && !insideCode) {
      if (buffer.length > 0) {
        yield buffer.join("\n");
        buffer = [];
      }
    } else {
      buffer.push(line);
    }
  }
  yield buffer.join("\n");
}

/** Takes iterable of string chunks and returns iterable of lines. */
async function* splitLines(strings: AsyncIterable<string>) {
  let buffer = "";
  for await (const str of strings) {
    buffer += str;
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";
    for (const line of lines) {
      yield line;
    }
  }
  yield buffer;
}

/** Adds null values to async iterable every `delay` milliseconds. */
async function* intersperseNulls<T>(iterable: AsyncIterable<T>, delay: number) {
  const iterator = iterable[Symbol.asyncIterator]();
  let nextPromise = iterator.next();
  while (true) {
    yield null;
    const result = await Promise.race([
      nextPromise,
      new Promise<undefined>((resolve) => setTimeout(resolve, delay)),
    ]);
    if (result != null) {
      if (result.done) break;
      yield result.value;
      nextPromise = iterator.next();
    }
  }
}
