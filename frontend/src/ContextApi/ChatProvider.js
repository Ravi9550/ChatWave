import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const CreateChatContext = createContext();

const ChatProvider = ({children})=>{
    const [user, setUser] = useState();
    const [notification, setNotification] = useState([]);
    const [chats, setChats] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const navigate = useNavigate();

     useEffect(() => {
       const userInfo = JSON.parse(localStorage.getItem("userInfo"));
       setUser(userInfo);

       if (!userInfo)  navigate("/");  
     }, []);


    return (
      <CreateChatContext.Provider
        value={{
          selectedChat,
          setSelectedChat,
          user,
          setUser,
          notification,
          setNotification,
          chats,
          setChats,
        }}
      >
        {children}
      </CreateChatContext.Provider>
    );
};

export const ChatState = ()=>{
    return useContext(CreateChatContext);
}


export default ChatProvider;