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
const authorsJSONPath = join(authorsFolderPath, "./authors.json");

authorsRouter.get("/", (req, res) => {
  const contentAsBuffer = fs.readFileSync(authorsJSONPath);
  const contentAsString = contentAsBuffer.toString();
  const authors = JSON.parse(contentAsString);
  res.send(authors);
});



authorsRouter.get("/:id", (req, res) => {
  const contentAsBuffer = fs.readFileSync(authorsJSONPath);
  const contentAsString = contentAsBuffer.toString();
  const authors = JSON.parse(contentAsString);
  console.log(req.params);

  const author = authors.find((a) => a._id === req.params.id);

  res.send(author);
  // res.send(authors);
});



authorsRouter.post("/", (req, res) => {
  const newAuthor = { ...req.body, createdAt: new Date(), _id: uniqid() };

  console.log(newAuthor);

  const authors = JSON.parse(fs.readFileSync(authorsJSONPath).toString());

  authors.push(newAuthor);

  fs.writeFileSync(authorsJSONPath, JSON.stringify(authors));

  res.status(201).send(newAuthor._id);
});




authorsRouter.put("/:id", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath).toString());

  const remainingAuthors = authors.filter(
    (author) => author._id !== req.params.id
  );

  const updatedAuthor = { ...req.body, _id: req.params.id };

  remainingAuthors.push(updatedAuthor);

  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors));

  res.send(updatedAuthor);
});

authorsRouter.delete("/:id", (req, res) => {
  const authors = JSON.parse(fs.readFileSync(authorsJSONPath).toString());
  const remainingAuthors = authors.filter(
    (author) => author._id !== req.params.id
  );
  fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors));

  res.status(204).send();
});

export default authorsRouter;
