import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import { Server as SocketIOServer } from "socket.io";

import { connectToDatabase } from "./lib/socket/chat/actions/connectToDatabase.js";
import { initSocketHandlers } from "./lib/socket/chat/listeners/initSocketHandlers.js";
import { shutdownSocketHandler } from "./lib/socket/chat/listeners/shutdownSocketHandler.js";

//routes
import chatRouter from "./api/socket/chat/routes/index.js";
import { baseRoute as baseChatRoute } from "./api/socket/chat/routes/routePaths.js";

import validateRouter from "./api/validate/routes/index.js";
import { baseRoute as baseValidateRoute } from "./api/validate/routes/routePaths.js";

async function init() {
  let io;
  let server;

  try {
    //STEP 01 - FUNCTION connectToDatabase()
    await connectToDatabase(process.env.MONGODB_URI, process.env.MONGODB_DB);

    const corsOptions = {
      origin: `${process.env.FRONTEND_URL}:${process.env.FRONTEND_PORT}`, // Replace with connecting frontend URL to "allow" frontend to connect
      methods: ["GET", "POST", "PUT", "DELETE"], //explicitly allows only these HTTP methods for cross-origin requests.
      credentials: true, //whether or not the browser should include credentials (like cookies or HTTP authentication) with cross-origin requests. By default, credentials are not sent.
    };

    //STEP 02 - create express() instance 'app'
    console.log("SERVER: STEP 02 - create express() instance 'app'");
    const app = express(); //create express app

    //middleware
    app.use(cors(corsOptions)); //cors order important: needs to come before express.json()
    app.use(cookieParser()); //Cookie parsing middleware
    app.use(express.json()); //parse json application/json

    //routes
    app.use(baseValidateRoute, validateRouter);
    app.use(baseChatRoute, chatRouter);

    //error handling - 404 errors - catch-all for any requests that don't match existing routes (handle all misc routes)
    app.use((req, res) => {
      res.status(404).json({ status: "ERROR", message: "SERVER: Page Not Found" });
    });
    //error handling - handling general errors - handle errors that occur within your application
    app.use((err, req, res, next) => {
      console.error(err.stack);
      res.status(500).send("SERVER: Something broke!");
    });

    //STEP 03 - http.createServer(app)
    console.log("SERVER: STEP 03 - http.createServer(app)");
    server = http.createServer(app);

    //STEP 04 - create socket server and pass http server as prop
    //NOTE: socket server also receives cors options
    console.log("SERVER: STEP 04 - create socket server and pass http server as prop");
    io = new SocketIOServer(server, { cors: corsOptions });

    const serverPort = process.env.SERVER_PORT;

    //STEP 05 - listening on port 3000 - http listeners
    server.listen(serverPort, async (err) => {
      if (err) {
        throw err;
      }
      console.log(`SERVER: STEP 05 - listening on port ${serverPort}`);

      //initialize listeners (ORDER IMPORTANT: initInitialSocketHandlers requires server api endpoint so server needs to be running first)
      try {
        await initSocketHandlers(io); //STEP 06 & STEP 07 - FUNCTION initSocketHandlers()
        console.log("READY...");
      } catch (error) {
        console.error("error initializing handlers: ", error);
      }
    });

    shutdownSocketHandler(io);
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // Exit with failure code
  }
}
init();
