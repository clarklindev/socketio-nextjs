"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

import { useSocket } from "@/context/chat/SocketContext";
import { validateImageUrl } from "@/lib/validation/actions/validateImage";

import classes from "./Namespace.module.css";

export function Namespace(props) {
  const { joinNamespace } = useSocket();
  const { _id, name, image, endpoint, rooms } = props;

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkImage = async () => {
      const valid = await validateImageUrl(image); //'image' is url of the image
      setIsValid(valid);
    };
    checkImage();
  }, [image]);

  //add listeners
  // useEffect(() => {
  //   console.log("CLIENT: useEffect() called");
  //   let initializedSocket = null;

  //   const setupListeners = () => {
  //     if (selectedNsId && namespaceSockets[selectedNsId]) {
  //       initializedSocket = namespaceSockets[selectedNsId];

  //       initializedSocket.on("messageFromServer", (data) => {
  //         console.log(data);
  //       });

  //       initializedSocket.on("reconnect", (data) => {
  //         console.log("reconnect event!!!");
  //         console.log(data);
  //       });
  //     }
  //   };

  //   // Function to clean up listeners
  //   const cleanupListeners = () => {
  //     if (initializedSocket) {
  //       console.log("CLIENT: useEffect() cleanup cleanupListeners() called");
  //       initializedSocket.off("connect");
  //       initializedSocket.off("welcome");
  //       initializedSocket.off("messageFromServer");
  //       initializedSocket.off("reconnect");
  //       initializedSocket.disconnect();
  //     }
  //   };
  //   // Cleanup on component unmount
  //   /*
  //   Ensure Cleanup: Always call the cleanup function to remove listeners and disconnect the socket server when the socketServer instance changes or the component unmounts.
  //   */
  //   setupListeners();

  //   return () => {
  //     cleanupListeners();
  //   };
  // }, [selectedNsId]);

  // useEffect(() => {
  //   //addListeners job is to manage all listeners added to all namespaces.
  //   //this prevents listeners being added multiples times and makes life
  //   //better for us as developers.
  //   namespaceSockets[selectedNamespaceEndpoint].on("nsChange", (data) => {
  //     console.log("Namespace Changed!");
  //     console.log(data);
  //   });
  //   //adding listeners to the socket
  //   namespaceSockets[selectedNamespaceEndpoint].on("messageToRoom", (messageObj) => {
  //     console.log(messageObj);
  //     // document.querySelector("#messages").innerHTML += buildMessageHtml(messageObj);
  //   });
  // }, [namespaceSockets[selectedNamespaceEndpoint]]); //if new endpoint

  function clickHandler(event) {
    event.preventDefault();
    console.log("endpoint: ", endpoint);
    console.log("rooms IDs: ", rooms); //rooms is a list of id's part of retrieved namespace from db

    joinNamespace(endpoint, rooms);
  }

  // Validate image URL
  return (
    <div className="namespace" onClick={clickHandler}>
      {isValid ? (
        <Image src={image} alt="namespaces" width="100" height="50" className={classes[`namespace-icon`]} />
      ) : (
        <div className={classes.placeholder}>placeholder</div>
      )}
    </div>
  );
}
