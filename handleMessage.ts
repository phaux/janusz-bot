import { TgMessage, TgUser } from "@smol/gram";
import { Message } from "ollama";
import { bot } from "./bot.ts";
import { generateResponse } from "./generateResponse.ts";

const botUser = await bot.getMe();

export async function handleMessage(message: TgMessage) {
  /** Chat history sent to Ollama. */
  const chatMessages: Message[] = [];

  if (message.reply_to_message) {
    // Add replied to message to chat history.
    if (message.reply_to_message.from?.id !== botUser.id) return;
    chatMessages.push({
      role: "assistant",
      content: getMessageText(message.reply_to_message),
    });
  }

  const text = getMessageText(message);
  if (!text) {
    // If message is empty, say hello and return.
    const user = message.from;
    if (!user) return;
    await generateResponse(message.chat.id, message.message_id, [{
      role: "user",
      content: `Użytkownik ${getUserName(user)} napisał/a do ciebie. Przywitaj się!`,
    }]);
    return;
  }
  // Add current message to chat history.
  chatMessages.push({
    role: "user",
    content: text,
  });

  // Generate response based on chat history.
  await generateResponse(message.chat.id, message.message_id, chatMessages);
}

function getUserName(user: TgUser) {
  let name = user.first_name;
  if (user.last_name) {
    name += ` ${user.last_name}`;
  }
  if (user.username) {
    name += ` (@${user.username})`;
  }
  return name;
}

/** Get message text or caption and remove slash-command if present */
function getMessageText(message: TgMessage): string {
  let text = message?.text ?? message?.caption;
  if (text == null) return "";
  const entities = message?.entities ?? message?.caption_entities ?? [];
  const command = entities.find((entity) => entity.type === "bot_command");
  if (command) {
    text = text.slice(command.offset + command.length);
  }
  return text.trim();
}
