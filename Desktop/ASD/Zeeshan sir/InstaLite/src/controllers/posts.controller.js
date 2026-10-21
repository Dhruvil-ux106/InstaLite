const postsService = require("../services/posts.service");

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function create(req, res, next) {
  const { imageUrl, caption, location } = req.body;
  if (!imageUrl) return res.status(400).json({ error: "imageUrl is required" });

  try {
    return res.status(201).json(await postsService.createPost({ imageUrl, caption, location }));
  } catch (error) {
    return next(error);
  }
}

async function list(req, res, next) {
  try {
    return res.status(200).json(await postsService.listPosts());
  } catch (error) {
    return next(error);
  }
}

async function getOne(req, res, next) {
  const id = parseId(req.params.id);
  try {
    const post = id === null ? null : await postsService.getPostById(id);
    return post ? res.status(200).json(post) : res.status(404).json({ error: "Post not found" });
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  const id = parseId(req.params.id);
  const { caption, location } = req.body;
  const data = {};
  if (caption !== undefined) data.caption = caption;
  if (location !== undefined) data.location = location;

  try {
    if (id === null) return res.status(404).json({ error: "Post not found" });
    const post = await postsService.updatePost(id, data);
    return res.status(200).json(post);
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Post not found" });
    return next(error);
  }
}

async function remove(req, res, next) {
  const id = parseId(req.params.id);
  try {
    if (id === null) return res.status(404).json({ error: "Post not found" });
    await postsService.deletePost(id);
    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "Post not found" });
    return next(error);
  }
}

module.exports = { create, list, getOne, update, remove };
