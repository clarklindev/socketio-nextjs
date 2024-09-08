class Room {
  constructor(roomTitle, namespaceId, privateRoom = false) {
    this.roomTitle = roomTitle;
    this.namespaceId = namespaceId;
    this.privateRoom = privateRoom;
    this.history = [];
  }

  addMessage(message) {
    this.history.push(message);
  }

  clearHistory() {
    this.history = [];
  }
}

export default Room;
