const { Server } = require("socket.io");

let io;

function initSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ["http://localhost:3000", "http://localhost:3001"],
      credentials: true,
    },
  });


  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    // Applicant / owner joins their personal room (used by
    // adminController.updateRestaurantStatus -> io.to(`user_${ownerId}`))
    socket.on("user:join", (userId) => {
      if (!userId) {
        console.log("User ID missing");
        return;
      }

      const room = `user_${userId}`;

      socket.join(room);

      console.log(
        `Socket ${socket.id} joined room: ${room}`,
      );
    });

    // Restaurant owner joins restaurant room
    socket.on("restaurant:join", (restaurantId) => {
      if (!restaurantId) {
        console.log("Restaurant ID missing");
        return;
      }

      const room = `restaurant_${restaurantId}`;

      socket.join(room);

      console.log(
        `Socket ${socket.id} joined room: ${room}`,
      );
    });

    socket.on("disconnect", () => {
      console.log(
        "Socket disconnected:",
        socket.id,
      );
    });
  });

  return io;
}

function getIO() {
  if (!io) {
    throw new Error("Socket.IO not initialized");
  }

  return io;
}

module.exports = {
  initSocket,
  getIO,
};