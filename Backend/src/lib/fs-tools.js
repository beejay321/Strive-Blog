import fs from "fs-extra";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const { readJSON, writeJSON, writeFile, createReadStream } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const postCoverPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "../../public/img/cover"
);

export const getAuthors = async () =>
  await readJSON(join(dataFolderPath, "authors.json"));
export const getPosts = async () =>
  await readJSON(join(dataFolderPath, "blogPosts.json"));

export const writeAuthors = async (content) =>
  await writeJSON(join(dataFolderPath, "authors.json"), content);
export const writePosts = async (content) =>
  await writeJSON(join(dataFolderPath, "blogPosts.json"), content);

export const writePostCover = async (fileName, content) =>
  await writeFile(join(postCoverPath, fileName), content);

export const getCurrentFolderPath = (currentFile) =>
  dirname(fileURLToPath(currentFile));

export const readPostCover = (fileName) =>
  createReadStream(join(postCoverPath, fileName));
