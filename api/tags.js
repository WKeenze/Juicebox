const express = require('express');
const tagsRouter = express.Router();
const { getAllTags, getPostsByTagName } = require('../db');


tagsRouter.use((req, res, next) => {
  console.log("A request is being made to /tags");

  next();
});

tagsRouter.get('/', async (req, res) => {
    const posts = await getAllTags();
  res.send({
    posts
  });
});

tagsRouter.get('/:tagName/posts', async (req, res, next) => {
  // read the tagname from the params
  const tags = req.params;
  console.log(req.params)
  try {
    // use our method to get posts by tag name from the db
    const postByTagName = await getPostsByTagName(tags)
console.log(postByTagName)
    res.send(postByTagName)

    // send out an object to the client { posts: // the posts }
  } catch ({ name, message }) {
    // forward the name and message to the error handler
    next({ name, message });
  }
});

module.exports = tagsRouter;