import React, { useState, useEffect, useCallback } from "react";
import { ChatState } from "../../ContextApi/ChatProvider";
import { useToast } from "@chakra-ui/react";
import axios from "axios";
import { Text, Box, Stack, Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import GroupChat from "./GroupChat";
import { getSender } from "../../Config/ChatLogic";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = useCallback(async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      console.error(error);
      toast({
        title: "Error Occurred!",
        description: error.response
          ? error.response.data.message
          : "Failed to load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }, [user, toast, setChats]);

  useEffect(() => {
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));
    if (userInfo) {
      setLoggedUser(userInfo);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchChats();
      const intervalId = setInterval(fetchChats, 5000);

      return () => clearInterval(intervalId);
    }
  }, [user, fetchAgain, fetchChats]);

  return (
    <Box
      display={{ base: selectedChat ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        fontFamily="Work Roboto"
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        My Chats
        <GroupChat>
          <Button
            display="flex"
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Group Chat
          </Button>
        </GroupChat>
      </Box>

      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        borderRadius="lg"
        overflowY="hidden"
      >
        {chats && Array.isArray(chats) && chats.length > 0 ? (
          <Stack overflowY="scroll">
            {chats.map((chat) => {
              if (!chat) return null;

              return (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  key={chat._id}
                >
                  <Text>
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs">
                      <b>{chat.latestMessage.sender.name} : </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
              );
            })}
          </Stack>
        ) : (
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            h="100%"
          >
            <Text align="center" fontSize="lg" color="gray.500" w="100%" p={4}>
              No chats available. Start a new conversation!
            </Text>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default MyChats;
