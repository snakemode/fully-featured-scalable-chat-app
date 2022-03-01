import { ChatMessage } from "./ChatMessage";
import processMessageExtensions from "./Extensions/ContentExtensions";

export const ExtendedChatMessage = ({ item, sender, history, onSenderSelected }) => {
    const additionalContent = processMessageExtensions(item, history);

    return (
        <ChatMessage
            key={item.id}
            item={item}
            sender={sender}
            additionalContent={additionalContent}
            onSenderSelected={onSenderSelected}
        />
    );
}