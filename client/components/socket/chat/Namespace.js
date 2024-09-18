"use client";
import { useState, useEffect } from "react";
import Image from "next/image";

import { useSocket } from "@/context/socket/chat/ChatContext";
import { validateImage } from "@/lib/validation/actions/validateImage";

import classes from "./Namespace.module.css";

export function Namespace({ settings }) {
  const { joinNamespace } = useSocket();
  const { _id, name, image, endpoint, rooms } = settings;

  const [isValid, setIsValid] = useState(false);

  useEffect(() => {
    const checkImage = async () => {
      const valid = await validateImage(image); //'image' is url of the image
      setIsValid(valid);
    };
    checkImage();
  }, [image]);

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
