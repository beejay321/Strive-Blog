import express from "express"; // third party module(needs to ne installed)
import fs from "fs"; // core module (does not need to be installed)
import uniqid from "uniqid";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { validationResult } from "express-validator";
import createError from "http-errors";
import { blogPostsValidation } from "./validation.js";
import { getPosts, writePosts } from "../lib/fs-tools.js";
import { writePostCover, readPostCover } from "../lib/fs-tools.js";
import multer from "multer";

const BlogPostsRouter = express.Router();

// const filePath = fileURLToPath(import.meta.url);
// const __dirname = dirname(filePath);
// const blogPostsJSONPath = join(__dirname, "../data/blogPosts.json");

// const getPosts = () => {
//   const content = fs.readFileSync(blogPostsJSONPath);
//   console.log(content);
//   const blogPosts = JSON.parse(content);
//   return blogPosts;
// };
// const writePosts = (blogPosts) => {
//   fs.writeFileSync(blogPostsJSONPath, JSON.stringify(blogPosts));
// };

/****************GET POSTS******************/

BlogPostsRouter.get("/", async (req, res, next) => {
  try {
    const blogPosts = await getPosts();
    console.log(blogPosts);
    res.send(blogPosts);
  } catch (error) {
    next(error);
  }
});

/****************GET SINGLE POST******************/

BlogPostsRouter.get("/:id", async (req, res, next) => {
  try {
    const blogPosts = await getPosts();
    console.log(req.params);
    const blogPost = blogPosts.find((a) => a._id === req.params.id);
    if (blogPost) {
      res.send(blogPost);
    } else {
      next(createError(404, `Post ${req.params.id} not found `));
      // createError(err.status, error.message)
    }
  } catch (error) {
    next(error);
  }
});
/****************GET COMMENTS ON POST******************/

BlogPostsRouter.get("/:id/comments", async (req, res, next) => {
  try {
    const blogPosts = await getPosts();
    console.log(req.params);
    const blogPost = blogPosts.find((a) => a._id === req.params.id);
    if (blogPost) {
      console.log(blogPost.comments);
      if (blogPost.comments) {
        res.send(blogPost.comments);
      } else {
        next(createError(404, `No Comments found`));
      }
    } else {
      next(createError(404, `Post ${req.params.id} not found `));
      // createError(err.status, error.message)
    }
  } catch (error) {
    next(error);
  }
});

/****************POST BLOGPOSTS******************/

BlogPostsRouter.post("/", blogPostsValidation, async (req, res, next) => {
  try {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(createError(400, { errorList: errors }));
    } else {
      console.log(req.body);

      const newBlogPost = { ...req.body, createdAt: new Date(), _id: uniqid() };
      // console.log(newBlogPost);

      const blogPosts = await getPosts();
      blogPosts.push(newBlogPost);
      // console.log(blogPosts);

      await writePosts(blogPosts);
      res.status(201).send(newBlogPost._id);
    }
  } catch (error) {
    next(error);
  }
});

/****************UPLOAD COVER******************/
BlogPostsRouter.post(
  "/:id/uploadCover",
  multer().single("cover"),
  async (req, res, next) => {
    try {
      console.log(req.file);
      await writePostCover(req.file.originalname, req.file.buffer);
      const link = `http://localhost:3001/img/cover/${req.file.originalname}`;

      const Posts = await getPosts();
      let updatedPosts = Posts.map((post) => {
        if (post._id === req.params.id) {
          post.cover = link;
        }
        return post;
      });
      await writePosts(updatedPosts);
      res.status(201).send();
    } catch (error) {
      next(error);
    }
  }
);

/****************POST BLOGPOSTS COMMENTS******************/

BlogPostsRouter.post("/:id/comments", async (req, res, next) => {
  try {
    console.log(req.body);

    const newComment = {
      ...req.body,
      createdAt: new Date(),
      _id: uniqid(),
    };
    console.log(newComment);

    const blogPosts = await getPosts();
    const blogPost = blogPosts.find((a) => a._id === req.params.id);

    console.log(blogPost.comments);
    blogPost.comments.push(newComment);
    writePosts(blogPosts);
    console.log(blogPost);
    res.status(201).send(newComment._id);
  } catch (error) {
    next(error);
  }
});

BlogPostsRouter.put("/:id", async (req, res, next) => {
  try {
    const blogPosts = await getPosts();
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

BlogPostsRouter.delete("/:id", async (req, res, next) => {
  try {
    const blogPosts = await getPosts();
    const remainingBlogPosts = blogPosts.filter(
      (blogPost) => blogPost._id !== req.params.id
    );

    writePosts(remainingBlogPosts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

filesRouter.post(
  "/:id/upload",
  multer().single("img"),
  async (req, res, next) => {
    try {
      console.log(req.file);
      await writeImage(req.file.originalname, req.file.buffer);
      console.log(imagePath);
      console.log(publicFolderPath);
      //   const link = `http://localhost:3001/img/${req.file.originalname}`;
      //   res.send(req.file.originalname);

      //   const Products = await getProducts();
      //   console.log(Products);

      //   const updatedProducts = Products.map((product) => {
      //     if (req.params.id === product._id) {
      //       product.imageUrl === req.file.originalname;
      //     }
      //     console.log(product);
      //   });
      //   await writeProducts(updatedProducts);
      res.send("ok");
    } catch (error) {
      next(error);
    }
  }
);

const remainingProducts = Products.filter((p) => p._id !== req.params.id);

const updatedProduct = { ...req.body, _id: req.params.id };

remainingProducts.push(updatedProduct);

writeProducts(remainingProducts);

res.send(updatedProduct);

const newProduct = {
  ...req.body,
  img: link,
  createdAt: new Date(),
  // _id: uniqid(),
};
console.log(newProduct);

const Products = await getProducts();
Products.push(newProduct);
console.log(Products);

await writeProducts(Products);
res.status(201).send(newProduct);

export default BlogPostsRouter;
