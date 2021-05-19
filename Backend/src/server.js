import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import authorsRoutes from "./BlogAuthors/index.js";
import blogPostsRoutes from "./BlogPosts/index.js";
import {
  badRequestErrorHandler,
  notFoundErrorHandler,
  forbiddenErrorHandler,
  catchAllErrorHandler,
} from "./errorHandlers.js";

const server = express();

const port = 3001;

server.use(cors());
server.use(express.json());

server.use("/authors", authorsRoutes);

server.use("/blogPosts", blogPostsRoutes);

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(forbiddenErrorHandler);
server.use(catchAllErrorHandler);

console.log(listEndpoints(server));
console.table(listEndpoints(server));

server.listen(port, () => {
  console.log("Server is running on port: ", port);
});
