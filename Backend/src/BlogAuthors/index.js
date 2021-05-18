import express from "express";
import fs from "fs";
import path from "path";
// import uniqid from "uniqid";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { parse } from "node:path";

const authorsRouter = express.Router();

const filePath = fileURLToPath(import.meta.url);
const authorsFolderPath = dirname(filePath);
const authorsJSONPath = join(authorsFolderPath, "authors.json");

authorsRouter.get("/", (req, res) => {
  const contentAsBuffer = fs.readFileSync(authorsJSONPath);
  const contentAsString = contentAsBuffer.toString();
  const authors = JSON.parse(contentAsString);
  res.send(authors);
});
authorsRouter.post("/", (req, res) => {
  const contentAsBuffer = fs.readFileSync(authorsJSONPath);
  
});
authorsRouter.put("/", (req, res) => {
  const contentAsBuffer = fs.readFileSync(authorsJSONPath);
  
});
authorsRouter.delete("/", (req, res) => {
  const contentAsBuffer = fs.readFileSync(authorsJSONPath);
  
});

export default authorsRouter;
