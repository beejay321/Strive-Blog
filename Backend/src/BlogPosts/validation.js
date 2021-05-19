import {body} from "express-validator"

export const blogPostsValidation = [
    body("category").exists().withMessage("category is a mandatory field"),
    body("title").exists().withMessage("title is a mandatory field"),
    body("cover").exists().withMessage("cover is a mandatory field"),
    body("readTime.value").exists().withMessage("value is a mandatory field").isInt().withMessage("value must be an integer"),
    body("readTime.unit").exists().withMessage("unit is a mandatory field"),
    body("author.name").exists().withMessage("name is a mandatory field"),
    body("author.avatar").exists().withMessage("avatar is a mandatory field"),
    body("content").exists().withMessage("content is a mandatory field"),
]