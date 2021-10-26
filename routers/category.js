const { Router } = require("express");
const router = new Router();

const Category = require("../models").category;

// GET all category names
router.get("/", async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.status(200).send(categories);
  } catch (e) {
    return res.status(500).send({ message: "Something went wrong, sorry" });
  }
});

module.exports = router;
