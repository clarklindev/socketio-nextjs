'use client';
import Image from "next/image"; 
import { useState, useEffect } from 'react';
import { useSocket } from "@/context/chat/SocketContext";

import classes from './Namespace.module.css';

const validateImageUrl = async (url) => {
  console.log('url:', url);

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}/api/validate/validateUrl?url=${encodeURIComponent(url)}`);
    const data = await res.json();
    return data.valid;
  } catch (error) {
    console.error('Error validating image URL:', error);
    return false;
  }
};

export function Namespace(props){
  const { setRoomIds} = useSocket();
  const { image } = props;
  
  const [isValid, setIsValid] = useState(false);
  
  useEffect(() => {
    const checkImage = async () => {
      const valid = await validateImageUrl(image);
      setIsValid(valid);
    };
    checkImage();
  }, [image]);

  function clickHandler(event){
    event.preventDefault();
    console.log("endpoint: ", props.endpoint);
    // console.log('clicked ns id: ', props._id);
    console.log('roomsIds: ', props.rooms);
    setRoomIds(props.rooms);
  }

  // Validate image URL
  return <div className="namespace" onClick={clickHandler}>
    {
      isValid ? 
        <Image src={props.image} alt="namespaces" width="100" height="50" className={classes[`namespace-icon`]}/> :
        <div className={classes.placeholder}>placeholder</div>
    }
  </div>
}