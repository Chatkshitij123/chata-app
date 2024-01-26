const app = require("./app");
//we need http module we create http server
const dotenv = require("dotenv");
const mongoose = require("mongoose");
dotenv.config({ path: "./config.env" });
const path = require("path");

//whenever there is exception in our code it will crash our server we have to handle it
process.on("uncaughtException", (err) => {
  console.log(err);
  process.exit(1); //exit the server
});

const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const User = require("./models/user");
const FriendRequest = require("./models/friendRequest");
const OneToOneMessage = require("./models/OnetoOneMessage");

// create an instance of Socket.io
//video 25
const io = new Server(server, {
  cors: {
    origin: "*", //what origin u r allowed us to connect
    methods: ["GET", "POST"],
  },
});

// const DB = process.env.DBURI.replace("<password>",process.env.DBPASSWORD);
const DB = process.env.DBURI;

mongoose
  .connect(DB, {
    useNewUrlParser: true, //there is an underline mongodb driver which has depreciated the current url parser
    // useCreateIndex: true,//mongo db used an insure index function which are used to call in order to index exits if they didn't
    //unsure was created
    // useFindAndModify: false,
    useUnifiedTopology: true, //it is going to be insure that we are using new mongodb engine//we want to used that
  })
  .then((con) => {
    console.log("DB connection is successful");
  })
  .catch((err) => {
    console.log(err);
  });

//3000, 5000

const port = process.env.PORT || 8000;

server.listen(port, () => {
  console.log(`App running on port ${port}`);
});

//video 25
io.on("connection", async (socket) => {
  console.log(JSON.stringify(socket.handshake.query));

  console.log("check");
  // console.log(socket);
  const user_id = socket.handshake.query["user_id"]; //it is going to contain the parameters from the client-side
  // const user_id = socket.handshake.query.user_id;
  console.log(user_id);
  const socket_id = socket.id;

  console.log(`User connected ${socket_id}`);

  if (user_id != null && Boolean(user_id)) {
    try {
      await User.findByIdAndUpdate(user_id, {
        socket_id,
        status: "Online",
      });
    } catch (error) {
      console.log(error);
    }
  }

  //we can write our socket event listeners here ....

  socket.on("friend_request", async (data) => {
    console.log(data.to);
    //  data => {to,from}
    //{to: "692002"-user with id}

    const to_user = await User.findById(data.to).select("socket_id");
    const from_user = await User.findById(data.from).select("socket_id");

    //create friend request

    await FriendRequest.create({
      sender: data.form,
      recipient: data.to,
    });

    //after  we have recieved the friend req. so i am user A i have send the req to this user with this id i must send & alert to the user with this id(data.to)
    //that u have a new req

    //TODO -> create a friend request
    //emit event => "new_friend_request"

    io.to(to_user?.socket_id).emit("new_friend_request", {
      //
      message: "New Friend Requests Received",
    });
    //emit event => "request_sent"
    io.to(from_user?.socket_id).emit("request_sent", {
      message: "Request sent successfully!",
    });
  });

  socket.on("accept_request", async (data) => {
    console.log(data);

    const request_doc = await FriendRequest.findById(data.request_id);

    console.log(request_doc);

    //request_id-who is the sender of the request, who rec. this req. and when send

    const sender = await User.findById(request_doc.sender);
    const receiver = await User.findById(request_doc.recipient);
    //pushing the id of the friend who just accepted their req.
    sender.friends.push(request_doc.recipient);
    receiver.friends.push(request_doc.select);

    await receiver.save({ new: true, validateModifiedOnly: true });
    await sender.save({ new: true, validateModifiedOnly: true });

    //delete the req from database

    await FriendRequest.findByIdAndDelete(data.request_id);

    //notify the user

    io.to(sender?.socket_id).emit("request_accepted", {
      message: "Friend Request Accepted",
    });
    io.to(receiver?.socket_id).emit("request_accepted", {
      message: "Friend Request Accepted",
    });
  });

  //video 30
  socket.on("get_direct_conversations", async ({ user_id }, callback) => {
    const existing_conversations = await OneToOneMessage.find({
      participants: { $all: [user_id] },
    }).populate("participants", "firstName lastName _id email status");

    console.log(existing_conversations);

    callback(existing_conversations);
  });

  socket.on("start_conversation", async (data) => {
    //data: {to,from}
    const { to, from } = data;
    // checking there is any existing conversations b/w the users
    const existing_conversation = await OneToOneMessage.find({
      participants: { $size: 2, $all: [to, from] }, //why populate as this will be stored as a object_id in database
    }).populate("participants", "firstName lastName _id email status");
    //here we are performing a find query that is gonna to return us an list
    console.log(existing_conversation[0], "Existing Conversation");

    // if no existing_conversation
    if (existing_conversation.length === 0) {
      let new_chat = await OneToOneMessage.create({
        participants: [to, from],
      });

      new_chat = await OneToOneMessage.findById(new_chat._id).populate(
        "participants",
        "firstName lastName _id email status"
      );

      console.log(new_chat);
      socket.emit("start_chat", new_chat);
    }
    //if there is existing_conversation
    else {
      socket.emit("start_chat", existing_conversation[0]);
    }
  });

  socket.on("get_messages", async (data, callback) => {
    const { messages } = await OneToOneMessage.findById(
      data.conversation_id
    ).select("messages");
    callback(messages);
  });

  //Handle text handling messages//video28

  socket.on("text_message", async (data) => {
    console.log("Received Message", data);

    //data: {to,from,message, conversation_id, type}

    const { to, from, message, conversation_id, type } = data;

    const to_user = await User.findById(to);
    const from_user = await User.findById(from);

    const new_message = {
      to,
      from,
      type,
      text: message,
      created_at: Date.now(),
    };

    //create a new conversation if it doesnot exist yet or add new message to the messages list
    const chat = await OneToOneMessage.findById(conversation_id);
    chat.messages.push(new_message);
    //save to db
    await chat.save({});
    // await chat.save({ new: true, validateModifiedOnly: true });
    //emit new_message -> to user
    io.to(to_user?.socket_id).emit("new_message", {
      conversation_id,
      message: new_message,
    });

    // emit new_message -> from user
    io.to(from_user?.socket_id).emit("new_message", {
      conversation_id,
      message: new_message,
    });
  });
  //other type of message is basically media or document message-> is sharing some kind of file with us and that file we received using socket.io  we will store
  //that in S3(aws)//we receving the url and repeat the same steps.

  socket.on("file_message", (data) => {
    console.log("Received Message", data);

    //data: {to,from,text}

    //get the file_extension

    const file_extension = path.extname(data.file.name);

    // generate a unique filename

    const fileName = `${Date.now()}_${Math.floor(
      Math.random() * 10000
    )}${file_extension}`;

    //upload file to AWS S3

    //data: {to,from,text}

    //create a new conversation if it doesnot exist yet or add new message to the messages list

    //save to db

    //emit incoming_message -> to user

    // emit outgoing_message -> from user
  });

  socket.on("end", async (data) => {
    //find user by _id, set the status to offline
    if (data.user_id) {
      await User.findByIdAndUpdate(data.user_id, {
        status: "Offline",
      });
    }

    //TOD=> Broadcast user_disconnected
    console.log("Closing connection");
    socket.disconnect(0); //it is close the connection for this particular socket
  });
});

process.on("unhandledRejection", (err) => {
  console.log(err);
  server.close(() => {
    process.exit(1);
  });
});
