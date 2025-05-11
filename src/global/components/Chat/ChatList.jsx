import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useChat } from './../../../Context/ChatContext';

const ChatList = () => {

    const { id } = useParams();
    const {setChatUser, notify} = useChat();
    const [chats, setChats] = useState([]);

    const myID = JSON.parse(localStorage.getItem('user')).id;
    const myName = JSON.parse(localStorage.getItem('user')).name;
    

    useEffect(() => {
        axios.get(`https://localhost:7237/api/Messages/distinct-senders/${myID}`)
        .then(response => {
            console.warn(response.data);
            if(response.data.length == 0) {
                return;
            }
            const filteredChat = response.data.reduce((acc, curr) => {
                const existingChat = acc.find(chat => (chat.senderID == curr.senderID && chat.senderName == curr.senderName ) || (chat.senderID == curr.recieverID && chat.senderName == curr.recieverName));
                if (!existingChat) {
                    acc.push({
                        ...curr,
                        senderID: curr.senderID == myID ? curr.recieverID : curr.senderID,
                        senderName: curr.senderID == myID ? curr.recieverName : curr.senderName
                    });
                }
                return acc;
            }, []);

            setChats(filteredChat);
        })
        .catch(error => {
            console.warn(error);
        });
    }, [notify]);

    
    

    useEffect(() => { 
        if (id && chats.length > 0) {
                // console.log(chats);
            setChatUser(prev => ({
                ...prev,
                recieverID: id,
                recieverName: chats.filter((chat) =>
                chat.senderID == id ? chat.senderName : ""
                )[0].senderName,
                name: myName,
                id: myID,
            }));
            } if(!id) {
            setChatUser((prev) => ({
                ...prev,
                name: myName,
                id: myID,
            }));
            }
    }, [id,myID]);

    
    

if (chats.length == 0) {
    return (
        <div style={{backgroundColor: "#EAECEE", height: "88vh", overflow: "auto"}}>
            <ul style={{listStyle: "none", margin: "0", paddingLeft: "0"}}>
                <li style={{paddingTop: "10px", paddingBottom: "10px", backgroundColor: "#2C3E50", borderBottom: "solid", borderBottomColor: "#1A2D42", marginLeft: "10px", marginRight: "10px", cursor: "pointer", transition: "background-color 0.3s ease"}}>
                    <span style={{fontWeight: "bold", color: "white"}}>No messages yet</span>
                </li>
            </ul>
        </div>
    )
}

    return (
        <div style={{backgroundColor: "#EAECEE", height: "88vh", overflow: "auto"}}>
            <ul style={{listStyle: "none", margin: "0", paddingLeft: "0"}}>

            {chats.map((chat, index) => (
                <Link key={index} to={`/chat/${chat.senderName}/${chat.senderID}`} style={{textDecoration: "none"}}>
                    <li key={index} style={{paddingTop: "10px", paddingBottom: "10px", backgroundColor: (chat.senderID) == id ? "#2C3E50" : "#4A6572", borderBottom: "solid", borderBottomColor: "#1A2D42", cursor: "pointer", transition: "background-color 0.3s ease"}}>
                        <img src="assets/avatar.png" alt="profile" style={{maxWidth:"40px", marginLeft: "10px", marginRight: "10px"}} />
                        <span style={{ fontWeight: "bold", color: "white" }}>{chat.senderName}
                            {notify.length > 0 && notify.filter((n) => n.id === chat.senderID).length > 0 &&
                            (
                                
                            <span className=" mx-1  badge rounded-pill bg-danger">
                                {notify.filter((n) => n.id === chat.senderID).length}
                                <span className="visually-hidden">unread messages</span>
                            </span>
                        )}

                        </span>
                    </li>
                </Link>
                

            ))}

            </ul>
        </div>
    )
}

export default ChatList
