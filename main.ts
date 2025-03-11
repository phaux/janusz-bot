import { bot } from "./bot.ts";
import { handleMyChatMember } from "./handleMyChatMember.ts";
import { handleMessage } from "./handleMessage.ts";

const updates = bot.listUpdates({
  allowed_updates: ["message", "my_chat_member"],
  timeout: 10,
});
for await (const update of updates) {
  if (update.my_chat_member) {
    const member = update.my_chat_member;
    await handleMyChatMember(member).catch((error) => {
      console.error("Failed to handle my chat member:", error);
    });
  }

  if (update.message) {
    const message = update.message;
    await handleMessage(message)
      .catch((error) =>
        bot.sendMessage({
          chat_id: message.chat.id,
          reply_parameters: { message_id: message.message_id },
          text: `Coś się zjebało: ${error}`,
        })
      )
      .catch((error) => {
        console.error("Failed to send error message:", error);
      });
  }
}
