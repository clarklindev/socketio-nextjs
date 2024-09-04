"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

import { useSocket } from "@/context/chat/SocketContext";
import { validateImageUrl } from "@/lib/validation/validateImage";

import classes from "./Namespace.module.css";

export function Namespace(props) {
  const { setNamespaceRoomList } = useSocket();
  const { image, endpoint, rooms } = props;

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkImage = async () => {
      const valid = await validateImageUrl(image); //'image' is url of the image
      setIsValid(valid);
    };
    checkImage();
  }, [image]);

  function clickHandler(event) {
    event.preventDefault();
    console.log("endpoint: ", endpoint);
    // console.log('clicked ns id: ', props._id);

    //rooms
    // console.log("roomList: ", rooms);
    // setNamespaceRoomList(rooms);
  }

  // Validate image URL
  return (
    <div className="namespace" onClick={clickHandler}>
      {isValid ? (
        <Image src={props.image} alt="namespaces" width="100" height="50" className={classes[`namespace-icon`]} />
      ) : (
        <div className={classes.placeholder}>placeholder</div>
      )}
    </div>
  );
}
