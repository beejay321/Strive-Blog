import express from "express"; // third party module(needs to ne installed)
import fs from "fs"; // core module (does not need to be installed)
import path from "path";
import uniqid from "uniqid";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { parse } from "node:path";
import { url } from "inspector";

const authorsRouter = express.Router();

const filePath = fileURLToPath(import.meta.url);
const authorsFolderPath = dirname(filePath);
const authorsJSONPath = join(authorsFolderPath, "authors.json");
console.log(url);

authorsRouter.get("/", (req, res) => {
  const contentAsBuffer = fs.readFileSync(authorsJSONPath);
  console.log(contentAsBuffer);
  const contentAsString = contentAsBuffer.toString();
  console.log(contentAsString);
  const authors = JSON.parse(contentAsString);
  res.send(authors);
  // res.send({
  //   filePath,
  //   authorsFolderPath,
  //   url: import.meta.url,
  //   authorsJSONPath,
  // });
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
  console.log(req.url);
  console.log(req.headers);
  res.send("I am the post");
  console.log(req.body);

  // const newAuthor = req.body;
  const newAuthor = { ...req.body, createdAt: new Date(), _id: uniqid() };

  console.log(newAuthor);

  const authors = JSON.parse(fs.readFileSync(authorsJSONPath).toString());

  authors.push(newAuthor);

  console.log(authors);
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
  // res.send("I am the delete request");

  res.status(204).send();
});

export default authorsRouter;
