import express from "express";
import createError from "http-errors";

import UserModel from "./schema.js";

const usersRouter = express.Router();

usersRouter.get("/", async (req, res, next) => {
  try {
    const users = await UserModel.find();
    res.send(users);
  } catch (error) {
    console.log(error);
    next(createError(500, "An error occurred while getting user"));
  }
});

usersRouter.get("/:id", async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await UserModel.findById(id);
    if (user) {
      res.send(user);
    } else {
      next(createError(404, `User ${req.params.id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(createError(500, "An error occurred while getting user"));
  }
});

usersRouter.post("/", async (req, res, next) => {
  try {
    const newUser = new UserModel(req.body);
    const { _id } = await newUser.save();

    res.status(201).send(_id);
  } catch (error) {
    console.log(error);
    if (error.name === "ValidationError") {
      next(createError(400, error));
    } else {
      next(createError(500, "An error occurred while saving user"));
    }
  }
});

usersRouter.put("/:id", async (req, res, next) => {
  try {
    const user = await UserModel.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
      new: true,
    });
    if (user) {
      res.send(user);
    } else {
      next(createError(404, `User ${req.params.id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(createError(500, "An error occurred while modifying user"));
  }
});

usersRouter.delete("/:id", async (req, res, next) => {
  try {
    const user = await UserModel.findByIdAndDelete(req.params.id);
    if (user) {
      res.status(204).send();
    } else {
      next(createError(404, `User ${req.params.id} not found`));
    }
  } catch (error) {
    console.log(error);
    next(createError(500, "An error occurred while deleting student"));
  }
});

export default usersRouter;
