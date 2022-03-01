import React, { useState } from "react";
import useProfileData from "../../hooks/useProfileData";
import { FloatingTogglableProfile } from "../Profile";
import { ExtendedChatMessage } from "./ExtendedChatMessage";

export const ChatList = ({ messages }) => {
  const { userIds, chatMessages } = parseMessages(messages);

  const [messageElements, setMessageElements] = useState([]);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [profileTarget, setProfileTarget] = useState({ top: 0, right: 0 });

  const closeProfile = () => { setSelectedProfile(""); };
  const showProfile = (target, userId) => {
    const { top, right } = target.getBoundingClientRect();
    setProfileTarget({ top, right });
    setSelectedProfile(userId);
  };

  useProfileData(userIds, (profiles) => {
    const renderedMessages = chatMessages.map((item) => {
      const sender = profiles[item.clientId];
      return (
        <ExtendedChatMessage
          key={item.id}
          item={item}
          sender={sender}
          history={messages}
          onSenderSelected={showProfile}
        />
      );
    });

    setMessageElements(renderedMessages);
  }, [messages]);

  return (
    <>
      {messageElements}
      <FloatingTogglableProfile userId={selectedProfile} target={profileTarget} onClose={closeProfile} />
    </>
  );
};


function parseMessages(messages) {
  const dedupedMessages = messages.reduce((prev, message) => {
    if (!prev.some((m) => m.id === message.id)) {
      prev.push(message);
    }
    return prev;
  }, []);

  const userIds = messages.map((item) => { return item.clientId; }).filter(x => x !== undefined);
  const chatMessages = dedupedMessages.filter((item) => { return item.name === "message" });
  const uniqueUserIds = userIds.filter((n, i) => userIds.indexOf(n) === i);

  return {
    messages: messages,
    deduplicatedMessages: dedupedMessages,
    chatMessages: chatMessages,
    userIds: uniqueUserIds,
  }
}
