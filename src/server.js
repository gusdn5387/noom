import http from "http";
// import WebSocket from "ws";
// import SocketIO from "socket.io";
import {Server} from "socket.io";
import {instrument} from "@socket.io/admin-ui";
import express from "express";

const app = express();

app.set('view engine', 'pug');
app.set("views", __dirname + "/views");
app.use("/public", express.static(__dirname + "/public"));
app.get("/", (req, res) => res.render("home"));
app.get("/*", (req, res) => res.redirect("/"));

const handleListen = () => console.log('Listening on http://localhost:3000');

const server = http.createServer(app);
// const io = SocketIO(server);
const io = new Server(server, {
  cors: {
    origin: ["https://admin.socket.io"],
    credentials: true,
  },
});

instrument(io, {
  auth: false,
});

io.on("connection", (socket) => {
  socket.on("join_room", (roomName) => {
    socket.join(roomName);
    socket.to(roomName).emit("welcome");
  });
  socket.on("offer", (offer, roomName) => {
    socket.to(roomName).emit("offer", offer);
  });
  socket.on("answer", (answer, roomName) => {
    socket.to(roomName).emit("answer", answer);
  });
  socket.on("ice", (ice, roomName) => {
    socket.to(roomName).emit("ice", ice);
  });
});

// socket.io chat (시작)
// function publicRooms() {
//     // const sids = io.sockets.adapter.sids;
//     // const rooms = io.sockets.adapter.rooms;
//     const {
//       sockets: {
//         adapter: {sids, rooms},
//       },
//     } = io;
//
//     const publicRooms = [];
//
//     rooms.forEach((_, key) => {
//       if (sids.get(key) === undefined) publicRooms.push(key);
//     });
//
//     return publicRooms;
// }
//
// function countRoom(roomName) {
//     return io.sockets.adapter.rooms.get(roomName)?.size;
// }
//
// io.on("connection", (socket) => {
//   socket["nickname"] = "Anon";
//   socket.onAny((event) => {
//     console.log(`Socket Event: ${event}`);
//   });
//   socket.on("enter_room", (roomName, done) => {
//     socket.join(roomName);
//     done();
//     socket.to(roomName).emit("welcome", socket.nickname, countRoom(roomName));
//     io.sockets.emit("room_change", publicRooms());
//   });
//   socket.on("disconnecting", () => {
//     socket.rooms.forEach((room) => socket.to(room).emit("bye", socket.nickname, countRoom(room) - 1));
//   });
//   socket.on("disconnect", () => {
//     io.sockets.emit("room_change", publicRooms());
//   });
//   socket.on("new_message", (msg, room, done) => {
//     socket.to(room).emit("new_message", `${socket.nickname}: ${msg}`);
//     done();
//   });
//   socket.on("nickname", (nickname) => (socket["nickname"] = nickname));
// });
// socket.io chat (끝)

// WebSocket 사용 (시작)
// const wss = new WebSocket.Server({ server });
// const sockets = [];
//
// wss.on("connection", (socket) => {
//   sockets.push(socket);
//   socket["nickname"] = "Anon";
//   console.log("Connected to Browser");
//   socket.on("close", () => console.log("Disconnected from Server"));
//   socket.on("message", (msg) => {
//     const message = JSON.parse(msg.toString());
//     switch (message.type) {
//         case "new_message":
//           sockets.forEach((aSocket) =>
//             aSocket.send(`${socket.nickname}: ${message.payload}`)
//           );
//         case "nickname":
//           socket["nickname"] = message.payload;
//     }
//     // socket.send(message.toString());
//   });
// });
// WebSocket 사용 (끝)

server.listen(3000, handleListen);
