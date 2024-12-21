import React from "react";
import "./index.css";
import App from "./App";
import { ChakraProvider } from "@chakra-ui/react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import ChatProvider from "./ContextApi/ChatProvider";

const root = createRoot(document.getElementById("root"));
root.render(
   <ChakraProvider>
  <BrowserRouter>
  <ChatProvider>
      <App />
    </ChatProvider>
  </BrowserRouter>
  </ChakraProvider>

 
);
