import React, { useState, useEffect } from "react";
import { useAuth } from "../../AppProviders";
import ChannelList from "./ChannelList";
import ChatContainer from "../Chat/ChatContainer";
import { useChannel } from "@ably-labs/react-hooks";
import { ControlChannel } from "../../sdk/Channels";

// eslint-disable-next-line react/function-component-definition
export default function ({ toggleChannelView }) {
  const { api } = useAuth();
  const [channels, setChannels] = useState([]);
  const [currentChannel, setCurrentChannel] = useState("global-welcome");

  const fetchChannels = async () => {
    const response = await api.listChannels();
    setChannels(response.channels);
  };

  useChannel(ControlChannel, "channels-updated", (message) => {
    fetchChannels();
  });

  useEffect(() => {
    fetchChannels();
  }, []);

  const channelSelected = (channel) => {
    setCurrentChannel(channel);
    toggleChannelView();
  };

  return (
    <>
      <ChannelList channels={channels} onChannelSelected={channelSelected} />
      <ChatContainer currentChannel={currentChannel} onChatExit={toggleChannelView} />
    </>
  );
}
