import mongoose from "mongoose";
const { Schema, model } = mongoose;

const blogPostsSchema = new Schema(
  {
    category: String,
    title: String,
    cover: String,
    author: {
      name: String,
      avatar: String,
    },
    content: String,
  }
  // {
  //     "category": "Student Stories",
  //     "title": "I was a salesman 6 months ago, and now I am a professional web developer",
  //     "cover": "https://striveschool.ghost.io/content/images/2020/11/Ervins.png",
  //     "readTime": {
  //         "value": 2,
  //         "unit": "minute"
  //     },
  //     "author": {
  //         "name": "Bri Cho",
  //         "avatar": "https://striveschool.ghost.io/content/images/2020/11/FBBRRZy5_400x400.jpg"
  //     },
  //     "content": "A short story"

  // }
);

export default model("blogPosts", blogPostsSchema);
