import { TgChat, TgChatMemberUpdated } from "@smol/gram";
import { generateResponse } from "./generateResponse.ts";

export async function handleMyChatMember(member: TgChatMemberUpdated) {
  if (
    (member.chat.type === "group" || member.chat.type === "supergroup") &&
    (member.new_chat_member.status === "member" ||
      member.new_chat_member.status === "administrator")
  ) {
    await generateResponse(member.chat.id, undefined, [{
      role: "user",
      content: `Zostałeś zaproszony do grupy ${getChatName(member.chat)}. Przywitaj się!`,
    }]);
  }
}

function getChatName(chat: TgChat) {
  let name = chat.title;
  if (chat.username) {
    name += ` (@${chat.username})`;
  }
  return name;
}
