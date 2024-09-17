import { disconnectFromDatabase } from "../actions/disconnectFromDatabase.js";

//NOTE: THIS WORKS IN LINUX but not in WINDOWS
/*
  on linux (console output):

  Shutting down...
  Starting cleanup...
  Attempting to close Socket.IO server...
  AFTER Attempting to close Socket.IO server...
  Socket.IO server closed
  Cleanup completed.
  Shutdown complete.
  */

async function handleShutdown(io, signal) {
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
    await disconnectFromDatabase();
  } catch (error) {
    console.error("Error during shutdown:", error);
  } finally {
    console.log("Shutdown complete.");
    process.exit(0); // Ensure process exits after cleanup
  }
}

// Handle graceful shutdown
export const shutdownSocketHandler = async (io) => {
  //graceful shutdown mechanism to close connections and cleanup resources when the server is terminated
  process.on("SIGTERM", async () => {
    handleShutdown(io, "SIGTERM");
  });
  //handle Ctrl+C in the terminal
  process.on("SIGINT", async () => {
    handleShutdown(io, "SIGINT");
  });
};
