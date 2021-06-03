import mongoose from "mongoose";
const { Schema, model } = mongoose;

const authorsSchema = new Schema(
  {
    name: { type: String, required: true },
    surname: { type: String, required: true },
    email: { type: String, required: true },
    DateofBirth: { type: String },
    //   required: true,
  },
  { timestamps: true }
);

authorsSchema.post("validate", function (error, doc, next) {
  if (error) {
    const err = createError(400, error);
    next(err);
  } else {
    next();
  }
});

export default model("author", authorsSchema);
