import mongoose from "mongoose"
import createError from "http-errors"

const { Schema, model } = mongoose

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    age: {
      type: Number,
      min: [18, "You are too young!"],
      max: 65,
      default: 18,
    },
    professions: [String],
    purchaseHistory: [
      {
        asin: String,
        title: String,
        price: Number,
        category: String,
        date: Date,
      },
    ],
  },
  { timestamps: true }
)

UserSchema.post("validate", function (error, doc, next) {
  if (error) {
    const err = createError(400, error)
    next(err)
  } else {
    next()
  }
})

export default model("User", UserSchema)