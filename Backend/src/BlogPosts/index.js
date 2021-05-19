import express from "express"; // third party module(needs to ne installed)
import fs from "fs"; // core module (does not need to be installed)
import uniqid from "uniqid";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { validationResult } from "express-validator";
import createError from "http-errors";
import { blogPostsValidation } from "./validation.js";

const BlogPostsRouter = express.Router();

const filePath = fileURLToPath(import.meta.url);
const __dirname = dirname(filePath);
const blogPostsJSONPath = join(__dirname, "blogPosts.json");

const getPosts = () => {
  const content = fs.readFileSync(blogPostsJSONPath);
  console.log(content);
  const blogPosts = JSON.parse(content);
  return blogPosts;
};
const writePosts = (blogPosts) => {
  fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPosts));
};

/****************GET POSTS******************/

BlogPostsRouter.get("/", (req, res, next) => {
  try {
    const blogPosts = getPosts();
    res.send(blogPosts);
  } catch (error) {
    next(error);
  }
});

/****************GET SINGLE POST******************/

BlogPostsRouter.get("/:id", (req, res, next) => {
  try {
    const blogPosts = getPosts();
    console.log(req.params);
    const blogPost = blogPosts.find((a) => a._id === req.params.id);
    if (blogPost) {
      res.send(blogPost);
    } else {
      next(createError(404, `Post ${req.params.id} not found `));
    }
  } catch (error) {
    next(error);
  }
});

/****************POST BLOGPOSTS******************/

BlogPostsRouter.post("/", blogPostsValidation, (req, res) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(createError(400, { errorList: errors }));
    } else {
      console.log(req.body);

      const newBlogPost = { ...req.body, createdAt: new Date(), _id: uniqid() };
      console.log(newBlogPost);

      const blogPosts = getPosts();
      blogPosts.push(newBlogPost);
      console.log(blogPosts);

      writePosts(blogPosts);
      res.status(201).send(newBlogPost._id);
    }
  } catch (error) {
    next(error);
  }
});

BlogPostsRouter.put("/:id", (req, res) => {
  try {
    const blogPosts = getPosts();
    const remainingBlogPosts = blogPosts.filter(
      (blogPost) => blogPost._id !== req.params.id
    );

    const updatedBlogPost = { ...req.body, _id: req.params.id };

    remainingBlogPosts.push(updatedBlogPost);

    writePosts(remainingBlogPosts);

    res.send(updatedBlogPost);
  } catch (error) {
    next(error);
  }
});

BlogPostsRouter.delete("/:id", (req, res) => {
  try {
    const blogPosts = getPosts();
    const remainingBlogPosts = blogPosts.filter(
      (blogPost) => blogPost._id !== req.params.id
    );

    writePosts(remainingBlogPosts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

export default BlogPostsRouter;
