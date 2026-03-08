import { formartShortDateTime } from "./util";
import { MessageWithSenderRecipient } from "@/types";

export function mapMessagetoMessageDto(message: MessageWithSenderRecipient) {
    return {
        id: message.id,
        text: message.text,
        created: formartShortDateTime(message.created),
        dateRead: message.dateRead ? formartShortDateTime(message.dateRead) : null,
        senderId: message.sender?.userId,
        senderName: message.sender?.name,
        senderImage: message.sender?.image,
        recipientId: message.recipient?.userId,
        recipientName: message.recipient?.name,
        recipientImage: message.recipient?.image
    }
}