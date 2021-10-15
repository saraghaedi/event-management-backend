const { Router } = require("express");
const Space = require("../models").space;
const authMiddleware = require("../auth/middleware");
const Event = require("../models").event;

const router = new Router();

router.post("/", authMiddleware, async (req, res, next) => {
  const { title, description, logo_url } = req.body;
  const userId = req.user.id;
  if (!title || !description) {
    return res
      .status(400)
      .send("Please provide a valid title and description ");
  }
  try {
    const newSpace = await Space.create({
      title,
      description,
      logo_url,
      userId,
    });
    res.status(201).json(newSpace);
  } catch (e) {
    console.log(e.message);
    return res.status(500).send({ message: "Something went wrong, sorry" });
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const spaceId = parseInt(req.params.id);
    const space = await Space.findOne({
      where: { id: spaceId },
      include: [Event],
    });
    if (!space) {
      return res.status(404).send({ message: "space not found" });
    }
    res.json(space);
  } catch (e) {
    console.log(e.message);
    return res.status(500).send({ message: "Something went wrong, sorry" });
  }
});

module.exports = router;
