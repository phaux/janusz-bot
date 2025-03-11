import { TgMessage, TgUser } from "@smol/gram";
import { Message } from "ollama";
import { bot } from "./bot.ts";
import { generateResponse } from "./generateResponse.ts";

const botUser = await bot.getMe();

export async function handleMessage(message: TgMessage) {
  const chatMessages: Message[] = [];

  if (message.reply_to_message) {
    if (message.reply_to_message.from?.id !== botUser.id) return;
    chatMessages.push({
      role: "assistant",
      content: getMessageText(message.reply_to_message),
    });
  }

  const text = getMessageText(message);
  if (!text) {
    const user = message.from;
    if (user) {
      await generateResponse(message.chat.id, message.message_id, [{
        role: "user",
        content: `Użytkownik ${getUserName(user)} napisał/a do ciebie. Przywitaj się!`,
      }]);
      return;
    }

    await bot.sendMessage({
      chat_id: message.chat.id,
      reply_parameters: { message_id: message.message_id },
      text: "Cześć! Co słychać?",
    });
    return;
  }

  chatMessages.push({
    role: "user",
    content: text,
  });

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
