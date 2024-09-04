import "dotenv/config";
import express from "express";
import cors from "cors";
import http from "http";
import cookieParser from "cookie-parser";
import { Server as SocketIOServer } from "socket.io";

import { connectToDatabase, disconnectFromDatabase } from "./lib/socket/db/db.js";
import { initDefaultNamespaceHandlers } from "./lib/socket/namespace/initDefaultNamespaceHandlers.js";
import { initNamespaceHandlers } from "./lib/socket/namespace/initNamespaceHandlers.js";
//routes
import socketRoutes from "./api/socket/routes/index.js";
import validateRoutes from "./api/validate/routes/index.js";

async function init() {
  let io;
  let server;

  try {
    //STEP 01 - FUNCTION connectToDatabase()
    const result = await connectToDatabase(process.env.MONGODB_URI, process.env.MONGODB_DB);

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
    app.use("/api/socket", socketRoutes);
    app.use("/api/validate", validateRoutes);

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

      //initialize listeners (ORDER IMPORTANT: initDefaultNamespaceSocketHandlers requires server api endpoint so server needs to be running first)
      try {
        await initDefaultNamespaceHandlers(io); //STEP 06 - FUNCTION initDefaultNamespaceHandlers()
        // await initNamespaceHandlers(io); //STEP 07 - FUNCTION initNamespaceHandlers()
        console.log("READY...");
      } catch (error) {
        console.error("error initializing handlers: ", error);
      }
    });

    // Handle graceful shutdown
    const shutdownHandler = async (signal) => {
      console.log(`FUNCTION shutdownHandler(${signal})`);

      try {
        console.log("Shutting down...");
        console.log("Starting cleanup...");

        await new Promise((resolve, reject) => {
          if (!io) {
            console.log("Socket.IO server was not initialized");
            return resolve(); // If io is not initialized, resolve immediately
          }

          console.log("Attempting to close Socket.IO server...");
          //This also closes the underlying HTTP server.
          io.close((err) => {
            if (err) {
              console.error("Error closing Socket.IO server:", err);
              reject(err);
            } else {
              console.log("Socket.IO server closed");
              resolve();
            }
          });
          console.log("AFTER Attempting to close Socket.IO server...");
        });

        console.log("Cleanup completed.");
        console.log("Disconnecting from database...");
        await disconnectFromDatabase();
        console.log("Disconnected from database.");
      } catch (error) {
        console.error("Error during shutdown:", error);
      } finally {
        console.log("Shutdown complete.");
        process.exit(0); // Ensure process exits after cleanup
      }
    };

    //NOTE: THIS WORKS IN LINUX but not in WINDOWS
    /*
    on linux (console output):

    Shutting down...
    Starting cleanup...
    Attempting to close Socket.IO server...
    AFTER Attempting to close Socket.IO server...
    Socket.IO server closed
    Cleanup completed.
    Disconnecting from database...
    SERVER: STEP CLEANUP - FUNCTION disconnectFromDatabase()
    SERVER: Disconnected from MongoDB
    Disconnected from database.
    Shutdown complete.
    */

    //graceful shutdown mechanism to close connections and cleanup resources when the server is terminated
    process.on("SIGTERM", async () => {
      await shutdownHandler("SIGTERM");
    });
    //handle Ctrl+C in the terminal
    process.on("SIGINT", async () => {
      await shutdownHandler("SIGINT");
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1); // Exit with failure code
  }
}
init();
