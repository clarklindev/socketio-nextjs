"use client";

import React from "react";

import { ChatContextProvider } from "@/context/socket/chat/ChatContext";

const ProvidersWrapper = ({ children }) => {
  return (
    <>
      <ChatContextProvider>{children}</ChatContextProvider>
    </>
  );
};

export default ProvidersWrapper;
