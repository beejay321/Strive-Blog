import express from "express"; // third party module(needs to ne installed)
import fs from "fs"; // core module (does not need to be installed)
import uniqid from "uniqid";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { validationResult } from "express-validator";
import createError from "http-errors";
import { blogPostsValidation } from "./validation.js";
import { getPosts, writePosts } from "../lib/fs-tools.js";
import { writePostCover, readPostCover, getPostsSource } from "../lib/fs-tools.js";
import multer from "multer";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { generatePDFStream } from "../lib/pdf.js";
import { pipeline } from "stream";
import { Transform } from "json2csv";
import blogPostsModel from "./schema.js";

const BlogPostsRouter = express.Router();

/****************POST BLOGPOSTS******************/

BlogPostsRouter.post("/", async (req, res, next) => {
  try {
    const newPost = new blogPostsModel(req.body);

    const mongoRes = await newPost.save();
    res.status(201).send(mongoRes);
  } catch (error) {
    next(error);
  }
});
/* BlogPostsRouter.post("/", blogPostsValidation, async (req, res, next) => {
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
}); */

/****************GET POSTS******************/
BlogPostsRouter.get("/", async (req, res, next) => {
  try {
    const allPosts = await blogPostsModel.find();

    res.send(allPosts);
  } catch (error) {
    console.log(error);
    next(error);
  }
});

// BlogPostsRouter.get("/", async (req, res, next) => {
//   try {
//     console.log(import.meta.url);
//     console.log(filePath);
//     console.log(__dirname);
//     console.log(blogPostsJSONPath);
//     const blogPosts = await getPosts();
//     // console.log(blogPosts);
//     res.send(blogPosts);
//   } catch (error) {
//     next(error);
//   }
// });

/****************GET SINGLE POST******************/
BlogPostsRouter.get("/:id", async (req, res, next) => {
  try {
    const singlePost = await blogPostsModel.findById(req.params.id);
    // const singlePosts = await blogPostsModel.findOne(${mongo query})

    if (singlePost) {
      res.send(singlePost);
    } else {
      next(createError(404, `Post ${req.params.id} not found `));
      // createError(err.status, error.message)
    }
  } catch (error) {
    console.log(error);
    next(error);
  }
});

/* BlogPostsRouter.get("/:id", async (req, res, next) => {
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
}); */

/****************UPDATE POST******************/
BlogPostsRouter.put("/:id", async (req, res, next) => {
  try {
    const singlePost = await blogPostsModel.findByIdAndUpdate(req.params.id, req.body, { runValidators: true, new: true });

    res.send(singlePost);
  } catch (error) {
    next(error);
  }
});

/* BlogPostsRouter.put("/:id", async (req, res, next) => {
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
}); */

/****************DELETE POST******************/
BlogPostsRouter.delete("/:id", async (req, res, next) => {
  try {
    const singlePost = await blogPostsModel.findByIdAndDelete(req.params.id);

    if (singlePost) {
      res.status(204).send();
    }
  } catch (error) {
    next(error);
  }
});

/* BlogPostsRouter.delete("/:id", async (req, res, next) => {
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
 */

/****************Download pdf******************/
BlogPostsRouter.get("/pdfDownload", async (req, res, next) => {
  try {
    const blogPosts = await getPosts();
    const source = generatePDFStream(blogPosts);
    const destination = res;
    res.setHeader("Content-Disposition", "attachment; filename=export.pdf");
    pipeline(source, destination, (err) => next(err));
  } catch (error) {
    next(error);
  }
});
/******************************Download pdf******************************************/
BlogPostsRouter.get("/pdftocsv", async (req, res, next) => {
  try {
    await generatePDF();

    res.send("generated");
  } catch (error) {
    next(error);
  }
});

/***************************Download csv**********************************************/
BlogPostsRouter.get("/csvDownload", async (req, res, next) => {
  try {
    const fields = ["_id", "category", "title", "cover"];
    const options = { fields };
    const jsonToCsv = new Transform(options);
    const source = getPostsSource();
    res.setHeader("Content-Disposition", "attachment; filename=export.csv");
    pipeline(source, jsonToCsv, res, (err) => next(err)); // source (file on disk) -> transform (json 2 csv) -> destination (rsponse)
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

/****************UPLOAD COVER******************/
BlogPostsRouter.post("/:id/uploadCove", multer().single("cover"), async (req, res, next) => {
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
    res.status(201).send(link);
  } catch (error) {
    next(error);
  }
});
/****************UPLOAD COVER USING CLOUDINARY******************/
const cloudinaryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "Strive",
  },
});

const upload = multer({ storage: cloudinaryStorage }).single("cover");

BlogPostsRouter.post("/:id/uploadCover", upload, async (req, res, next) => {
  try {
    console.log(req.file);
    const Posts = await getPosts();
    let updatedPosts = Posts.map((post) => {
      if (post._id === req.params.id) {
        post.cover = req.file.path;
        console.log(post.cover);
      }
      return post;
    });
    await writePosts(updatedPosts);
    res.send(req.file.path);
  } catch (error) {
    next(error);
  }
});

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
    const remainingBlogPosts = blogPosts.filter((blogPost) => blogPost._id !== req.params.id);

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
    const remainingBlogPosts = blogPosts.filter((blogPost) => blogPost._id !== req.params.id);

    writePosts(remainingBlogPosts);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
});

// export default BlogPostsRouter;
