const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
const Event = require("../models").event;
const Space = require("../models").space;

const router = new Router();

router.post("/", authMiddleware, async (req, res, next) => {
  const spaceId = await Space.findOne({ where: { userId: req.user.id } }).id;
  console.log("Space id is: ", spaceId);
  const {
    title,
    description,
    imageUrl,
    start_date,
    end_date,
    capacity,
    is_online,
    location,
  } = req.body;

  if (
    !title ||
    !description ||
    !start_date ||
    !end_date ||
    !capacity ||
    !is_online ||
    !location
  ) {
    return res
      .status(400)
      .send(
        "Please provide a valid title, description, description,imageUrl, start_date, end_date, capacity, is_online, location and spaceId "
      );
  }
  try {
    const newEvent = await Event.create({
      title,
      description,
      imageUrl,
      start_date,
      end_date,
      capacity,
      is_online,
      location,
      spaceId,
    });
    res.status(201).json(newEvent);
  } catch (e) {
    console.log(e.message);
    return res.status(500).send({ message: "Something went wrong, sorry" });
  }
});

module.exports = router;
