import io from "socket.io-client";

let socket;

const connectSocket = (user_id) => {
  console.log("check");
  socket = io("http://localhost:8000", {
    query: `user_id=${user_id}`,
  });
};

//

export { socket, connectSocket };
