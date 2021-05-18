import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import authorsRoutes from "./BlogAuthors/index.js";

const server = express();

const port = 3001;

server.use(cors());
server.use(express.json());

server.use("/authors", authorsRoutes);

console.log(listEndpoints(server));
console.table(listEndpoints(server));

server.listen(port, () => {
  console.log("Server is running on port: ", port);
});
