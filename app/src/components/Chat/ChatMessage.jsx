import React from "react";

export const ChatMessage = ({ item, sender, additionalContent, onSenderSelected }) => {

    const { id, username, profileImgSmallUrl } = sender;
    const messageTime = new Date(item.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    const onProfileClick = (e) => {
        onSenderSelected(e.target, id);
    };

    return (
        <li key={item.id} className="message">
            <button type="button" onClick={onProfileClick} className="message-button">
                <img className="message-thumbnail" src={profileImgSmallUrl} alt={username} />
            </button>
            <button className="sender message-button" type="button" onClick={onProfileClick}>
                {username}
            </button>
            <span className="time">{messageTime}</span>
            <span className="text">{item.data.text}</span>
            {additionalContent}
        </li>
    );
}
