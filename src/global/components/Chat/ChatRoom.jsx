import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.bubble.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { useParams } from 'react-router-dom';
import { useRef } from 'react';


const ChatRoom = () => {
    const { id } = useParams();
    const myID = 50;

    const [message, setMessage] = useState({ senderID: myID, receiverID: id, content: "" });

    
    const [messages, setMessages] = useState([
        { senderID: 50, receiverID: 4, content: "<p>Hey, how are you?</p>" },
        { senderID: 4, receiverID: 50, content: "<p>I'm good, thanks! How about you?</p>" },
        { senderID: 50, receiverID: 4, content: "<p>Doing great. Working on the new project.</p>" },
        { senderID: 4, receiverID: 50, content: "<p>Nice! Let me know if you need any help.</p>" },
    ]);
    
    //every id change will bring messages
    useEffect(() => {
        setMessage((prev) => ({ ...prev, receiverID: id }));
    }, [id]);
    
    const sendMessage = () => {
        if (message.content.trim() !== "") {
        setMessages([...messages, message]);
        setMessage({ ...message, content: "" }); // reset editor
        }
    };

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);
    


    return (
        <div
        style={{
            backgroundColor: "white",
            display: "flex",
            flexDirection: "column",
            height: "100%",
            justifyContent: "flex-end",
            width: "100%",
        }}
        className="col-12"
        >
        <div
            className="chatBox"
            style={{
            display: "flex",
            flexDirection: "column",
            overflowY: "auto",
            flexGrow: 1,
            padding: "10px",
            }}
        >
            {messages.map((msg, index) => {
            const isSender = msg.senderID === myID;

            return (
                <div
                key={index}
                style={{
                    display: "flex",
                    justifyContent: isSender ? "flex-end" : "flex-start",
                    width: "100%",
                }}
                >
                <div
                    style={{
                    maxWidth: "70%",
                    backgroundColor: isSender ? "#1A2D42" : "white",
                    color: isSender ? "white" : "black",
                    padding: "10px",
                    borderRadius: "10px",
                    margin: "5px",
                    fontSize: "14px",
                    textAlign: "left",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)",
                    }}
                    dangerouslySetInnerHTML={{ __html: msg.content }}
                />
                </div>
            );
            })}
            <div ref={messagesEndRef} />

        </div>

        <div
            className="textbar"
            style={{
            borderTop: "2px solid rgb(74 101 114 / 14%)",
            display: "flex",
            alignItems: "center",
            }}
        >
            <ReactQuill
            theme="bubble"
            value={message.content}
            onChange={(content) => setMessage({ ...message, content })}
            placeholder="Type your message here"
            style={{ width: "94%" }}
            />
            <button
            style={{ backgroundColor: "#1A2D42", flexGrow: 1, border: "none", height:"100%" }}
            onClick={sendMessage}
            >
            <FontAwesomeIcon icon={faPaperPlane} style={{ color: "white" }} />
            </button>
        </div>
        </div>
    );
};

export default ChatRoom;
