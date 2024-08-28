import { useEffect } from "react";
import { useSocket } from "@/context/chat/SocketContext";
import classes from './Rooms.module.css';

export const Rooms = ({children}) => {
  const {roomIds , setRooms } = useSocket();

  useEffect(()=>{
    const fetchRooms = async () => {
      if (roomIds.length > 0) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}:${process.env.NEXT_PUBLIC_SERVER_PORT}/api/socket/rooms?ids=${roomIds.join(',')}`);
          const data = await res.json();
          console.log('rooms: ', data);
          setRooms(data);

        } catch (error) {
          console.error('Error fetching rooms:', error);
        }
      }
      else{
        setRooms([])
      }
    };
    fetchRooms();
  },[roomIds]);//roomId's

  return <div className={classes.rooms}>{children}</div>
}