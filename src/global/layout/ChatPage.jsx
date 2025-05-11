import React from 'react'
import ChatList from './../components/Chat/ChatList'
import ChatRoom from './../components/Chat/ChatRoom'
import "bootstrap/dist/css/bootstrap.min.css";
import { useParams } from 'react-router-dom';

const ChatPage = () => {

    const {id} = useParams();
    return (
        <div>
        
            <div className="row" style={{paddingRight: "0", marginRight: "0"}}>
                <div className="col-3" style={{marginLeft: "0px", paddingRight:"0"}}>
                <ChatList/> 
                </div>
                <div className={id == null ? "container col d-flex justify-content-center align-items-center" : "col"} style={{paddingLeft:"0", paddingRight:"0", maxHeight: "88vh", maxWidth: "80%"}} >
                
                {id == null ? <div className="chatNotFound" style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <img src="assets/chat-background.jpg" alt="chat not found" style={{width: "50%"}}/>
                        </div> : <ChatRoom/> }
                        

                
                </div>
            </div>
            
        </div>
    )
}

export default ChatPage
