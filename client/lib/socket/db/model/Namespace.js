class Namespace {
  constructor(name, image, endpoint) {
    this.name = name;
    this.image = image;
    this.endpoint = endpoint;
    this.rooms = [];
  }

  addRoom(roomObj) {
    this.rooms.push(roomObj);
  }
}

export default Namespace;
