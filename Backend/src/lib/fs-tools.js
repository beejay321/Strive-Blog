import fs from "fs-extra"
import { fileURLToPath } from "url"
import { dirname, join } from "path"

const { readJSON, writeJSON, writeFile, createReadStream } = fs

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data")
const studentsFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../../public/img/students")

export const getAuthors = async () => await readJSON(join(dataFolderPath, "authors.json"))
export const getPosts = async () => await readJSON(join(dataFolderPath, "blogPosts.json"))

export const writeAuthors = async content => await writeJSON(join(dataFolderPath, "authors.json"), content)
export const writePosts = async content => await writeJSON(join(dataFolderPath, "blogPosts.json"), content)

export const writeStudentsPictures = async (fileName, content) => await writeFile(join(studentsFolderPath, fileName), content)

export const getCurrentFolderPath = currentFile => dirname(fileURLToPath(currentFile))

export const readStudentsPictures = fileName => createReadStream(join(studentsFolderPath, fileName))