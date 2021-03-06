import express from "express"; // third party module(needs to ne installed)
import createError from "http-errors";
import { validationResult } from "express-validator";
import multer from "multer";
import { generatePDFStream } from "../lib/pdf.js";
import { pipeline } from "stream";
import { Transform } from "json2csv";
import authorsModel from "./schema.js";

const authorsRouter = express.Router();

authorsRouter.post("/", async (req, res, next) => {
  try {
    const newAuthor = new authorsModel(req.body);

    const mongoRes = await newAuthor.save();
    res.status(201).send(mongoRes);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

authorsRouter.get("/", async (req, res, next) => {
  try {
    const authors = await authorsModel.find();
    res.send(authors);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

authorsRouter.get("/:id", async (req, res) => {
  try {
    const author = await authorsModel.findById(req.params.id);
    if (author) {
      res.send(author);
    } else {
      next(createError(404, `author with ${req.params.id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

/****************UPDATE Author******************/
authorsRouter.put("/:id", async (req, res, next) => {
  try {
    const singleAuthor = await authorsModel.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });

    res.send(singleAuthor);
  } catch (error) {
    next(error);
  }
});

/****************DELETE Author******************/
authorsRouter.delete("/:id", async (req, res, next) => {
  try {
    const singleAuthor = await authorsModel.findByIdAndDelete(req.params.id);

    if (singleAuthor) {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

/****************Download csv******************/
authorsRouter.get("/csvDownload", async (req, res, next) => {
  try {
    const fields = ["_id", "name", "surname", "email", "Date of Birth"];
    const options = [fields];
    const jsonToCsv = new Transform(options);
    const source = getAuthorsSource();
    res.setHeader("Content-Disposition", "attachment; filename=export.csv");
    pipeline(source, jsonToCsv, res, (err) => next(err)); // source (file on disk) -> transform (json 2 csv) -> destination (rsponse)
  } catch (error) {
    next(error);
  }
});

export default authorsRouter;
