import React from "react";
import { ChatState } from "../ContextApi/ChatProvider";
import { Box } from "@chakra-ui/react";
import Sidebar from "../Components/Others/Sidebar";
import ChatBox from "../Components/Others/ChatBox";
import MyChats from "../Components/Others/MyChats";
import { useState } from "react";

const Chats = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <Sidebar />}
      <Box
        display="flex"
        justifyContent="space-between"
        w="100%"
        h="91.5vh"
        p="10px"
      >
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default Chats;
