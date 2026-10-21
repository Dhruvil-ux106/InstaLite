const usersService = require("../services/users.service");

function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

async function create(req, res, next) {
  const { username, email, fullname, bio } = req.body;
  if (!username || !email || !fullname) {
    return res.status(400).json({ error: "username, email and fullname are required" });
  }

  try {
    const user = await usersService.createUser({ username, email, fullname, bio });
    return res.status(201).json(user);
  } catch (error) {
    if (error.code === "P2002") {
      return res.status(409).json({ error: "username or email already taken" });
    }
    return next(error);
  }
}

async function list(req, res, next) {
  try {
    return res.status(200).json(await usersService.listUsers());
  } catch (error) {
    return next(error);
  }
}

async function getOne(req, res, next) {
  const id = parseId(req.params.id);
  try {
    const user = id === null ? null : await usersService.getUserById(id);
    return user ? res.status(200).json(user) : res.status(404).json({ error: "User not found" });
  } catch (error) {
    return next(error);
  }
}

async function update(req, res, next) {
  const id = parseId(req.params.id);
  const { fullname, bio, isPrivate } = req.body;
  const data = {};
  if (fullname !== undefined) data.fullname = fullname;
  if (bio !== undefined) data.bio = bio;
  if (isPrivate !== undefined) data.isPrivate = isPrivate;

  try {
    if (id === null) return res.status(404).json({ error: "User not found" });
    const user = await usersService.updateUser(id, data);
    return res.status(200).json(user);
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "User not found" });
    return next(error);
  }
}

async function remove(req, res, next) {
  const id = parseId(req.params.id);
  try {
    if (id === null) return res.status(404).json({ error: "User not found" });
    await usersService.deleteUser(id);
    return res.status(204).send();
  } catch (error) {
    if (error.code === "P2025") return res.status(404).json({ error: "User not found" });
    return next(error);
  }
}

module.exports = { create, list, getOne, update, remove };
