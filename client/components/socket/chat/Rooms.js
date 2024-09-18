import { useEffect } from "react";

import { useSocket } from "@/context/socket/chat/ChatContext";
import { Room } from "./Room";

import classes from "./Rooms.module.css";

export const Rooms = () => {
  const { selectedNamespaceRoomIDs, saveFetchedRooms, db_rooms } = useSocket();

  useEffect(() => {
    const fetchRooms = async () => {
      console.log("FUNCTION fetchRooms()");
      if (selectedNamespaceRoomIDs && selectedNamespaceRoomIDs.length > 0) {
        try {
          const res = await fetch(
            `${process.env.NEXT_PUBLIC_SERVER_URL}:${
              process.env.NEXT_PUBLIC_SERVER_PORT
            }/api/socket/chat/rooms?ids=${selectedNamespaceRoomIDs.join(",")}`
          );
          const data = await res.json();
          console.log("rooms: ", data);
          saveFetchedRooms(data);
        } catch (error) {
          console.error("Error fetching rooms:", error);
        }
      } else {
        saveFetchedRooms([]);
      }
    };
    fetchRooms();
  }, [selectedNamespaceRoomIDs]); //roomID's

  const roomsDOM =
    db_rooms?.length > 0 &&
    db_rooms.map((room, index) => {
      return (
        <Room key={index} roomId={room._id}>
          {room.roomTitle}
        </Room>
      );
    });

  return <div className={classes.rooms}>{roomsDOM}</div>;
};
