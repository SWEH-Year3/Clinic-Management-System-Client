import React from 'react'
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

const ChatList = () => {

    const chats = ['John Doe', 'William Salvator', 'Damon', "Katherine"];

    const { id } = useParams();
    return (
        <div style={{backgroundColor: "#EAECEE", height: "88vh", overflow: "auto"}}>
            <ul style={{listStyle: "none", margin: "0", paddingLeft: "0"}}>

            {chats.map((chat, index) => (
                <Link to={`/chat/${index + 1}`} style={{textDecoration: "none"}}>
                    <li key={index} style={{paddingTop: "10px", paddingBottom: "10px", backgroundColor: (index + 1) == id ? "#2C3E50" : "#4A6572", borderBottom: "solid", borderBottomColor: "#1A2D42", cursor: "pointer", transition: "background-color 0.3s ease"}}>
                        <img src="/assets/avatar.png" alt="profile" style={{maxWidth:"40px", marginLeft: "10px", marginRight: "10px"}} />
                        <span style={{fontWeight: "bold", color: "white"}}>{chat}</span>
                    </li>
                </Link>
                
            ))}

            </ul>
        </div>
    )
}

export default ChatList
