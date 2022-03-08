import React, { useEffect, useRef, useState } from "react";
import { useChannel } from "@ably-labs/react-hooks";
import { ChatList } from "./ChatList";
import { ChatInput } from "./ChatInput";
import useArchive from "./../../hooks/useArchive";
import autoScrollHistory from "./autoScrollHistory";
import { useAuth } from "../../AppProviders";
import "./chat.css";

const ChatContainer = ({ currentChannel, onChatExit }) => {
  const endOfChatLog = useRef(null);
  const [history, setHistory] = useState([]);
  const [metadata, setMetadata] = useState({});

  const { api } = useAuth();

  useEffect(async () => {
    setHistory([]); // Reset history on channel change    
    setMetadata((await api.getChannelMetadata(currentChannel)));
  }, [currentChannel]);

  const [channel] = useChannel(currentChannel, (message) => {
    setHistory((prev) => [...prev.slice(-199), message]);
  });

  const [archive, rewind] = useArchive(currentChannel);

  const sendMessage = (messageText) => {
    channel.publish("message", { text: messageText });
  };

  autoScrollHistory(archive, endOfChatLog);

  return (
    <section className="chat">
      <header className="authed">
        <button className="exit" onClick={onChatExit} type="button">
          Back
        </button>
        <h2>
          {currentChannel}
          <span className="members">{metadata?.members?.length || 0} members</span>
        </h2>
      </header>
      <ul className="messages">
        <ChatList messages={archive} />
        <ChatList messages={history} />
        <li className="end-message" ref={endOfChatLog} />
      </ul>
      <ChatInput sendMessage={sendMessage} />
    </section >
  );
};

export default ChatContainer;
