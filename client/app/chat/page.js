//CLIENTSIDE
"use client";

import { Namespaces } from "@/components/chat/Namespaces";
import { Rooms } from "@/components/chat/Rooms";
import { Chatpanel } from "@/components/chat/Chatpanel";

import "./page.css";

// CLIENT-SIDE
export default function ChatPage() {
  //------------------------------------------
  return (
    <main>
      <div className="sidemenu">
        <Namespaces />
      </div>
      <div className="subsidemenu">
        <Rooms />
      </div>
      <div className="content">
        <Chatpanel />
      </div>
    </main>
  );
}
