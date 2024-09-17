export function leaveRooms(socket, rooms) {
  //NOTE: never leaves first room (which is socket itself's own room)
  //you can also create a var i=0, then increment i++
  //as forEach iterates in ascending order
  Array.from(rooms).forEach((room, index) => {
    //we dont want to leave the (socket.) sockets own room which is guaranteed to be first
    if (index !== 0) {
      socket.leave(room);
    }
  });
}
