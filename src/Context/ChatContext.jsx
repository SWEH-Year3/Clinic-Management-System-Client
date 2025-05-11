
import React, { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chatUser, setChatUser] = useState({
        id: '',
        name: '',
        recieverID: '',
        recieverName: '',
    });

    const [notify, setNotify] = useState([]);
    return (
        <ChatContext.Provider value={{ chatUser, setChatUser, notify, setNotify }}>
        {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => useContext(ChatContext);
