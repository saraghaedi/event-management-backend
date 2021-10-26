const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
const Event = require("../models").event;
const Space = require("../models").space;
const UserAttendance = require("../models").userAttendance;
const User = require("../models").user;
const Category = require("../models").category;
const Sequelize = require("sequelize");
const Op = Sequelize.Op;

const router = new Router();

router.post("/", authMiddleware, async (req, res, next) => {
  const space = await Space.findOne({ where: { userId: req.user.id } });
  const spaceId = space.id;
  const {
    title,
    description,
    imageUrl,
    start_date,
    end_date,
    capacity,
    is_online,
    location,
    price,
  } = req.body;

  if (
    !title ||
    !description ||
    !start_date ||
    !end_date ||
    !capacity ||
    !location
  ) {
    return res
      .status(400)
      .send(
        "Please provide a valid title, description, description,imageUrl, start_date, end_date, capacity, is_online, location, price and spaceId "
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
      price,
    });
    res.status(201).json(newEvent);
  } catch (e) {
    console.log(e.message);
    return res.status(500).send({ message: "Something went wrong, sorry" });
  }
});

router.get("/", async (req, res, next) => {
  try {
    const events = await Event.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(events);
  } catch (e) {
    console.log(e.message);
    return res.status(500).send({ message: "Something went wrong, sorry" });
  }
});
router.get("/:id", async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = await Event.findByPk(eventId);
    if (!event) {
      return res.status(404).send({ message: "event not found" });
    }
    res.json(event);
  } catch (e) {
    console.log(e.message);
    return res.status(500).send({ message: "Something went wrong, sorry" });
  }
});

router.put("/:id/buyTicket", authMiddleware, async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id);
    const userId = req.user.id;
    const { amount } = req.body;
    const eventToBeUpdated = await Event.findByPk(eventId);
    if (!amount) {
      return res.status(400).send({ message: "please provide an amount" });
    }
    if (!eventToBeUpdated) {
      return res.status(404).send({ message: "event not found" });
    }
    if (eventToBeUpdated.capacity < amount) {
      return res.status(400).send({
        message: `Not enugh capacity! capacity is ${eventToBeUpdated.capacity}`,
      });
    }
    const capacity = eventToBeUpdated.capacity - amount;
    const updatedEvent = await eventToBeUpdated.update({
      capacity,
    });

    const nrOfTickets = Array.from("x".repeat(amount));
    const results = [];

    for (i = 0; i < amount; i++) {
      results.push(
        await UserAttendance.create({
          userId,
          eventId,
        })
      );
    }

    const ticketsForEvent = await UserAttendance.findAll({
      where: { userId, eventId },
      include: [Event],
    });

    const cleanTicket = ticketsForEvent[0].get({ plain: true });

    res.json({
      event: updatedEvent,
      userAttend: { ...cleanTicket, quantity: ticketsForEvent.length },
    });
  } catch (e) {
    console.log(e.message);
    return res.status(500).send({ message: "Something went wrong, sorry" });
  }
});

router.get("/:id/attendance", authMiddleware, async (req, res, next) => {
  try {
    const eventId = parseInt(req.params.id);
    const event = await Event.findByPk(eventId, {
      include: {
        model: User,
        attributes: ["name", "email"],
      },
    });
    res.json(event);
  } catch (e) {
    console.log(e.message);
    return res.status(500).send({ message: "Something went wrong, sorry" });
  }
});

// SEARCH
router.get("/search/:text", async (req, res, next) => {
  const searchText = req.params.text;
  console.log("search text: ", searchText);
  if (!searchText) {
    return res.status(400).send("Please type in a search value!");
  }
  try {
    const events = await Event.findAll({
      // put them all to lowercase using Sequelize.fn "lower"
      where: {
        [Op.or]: [
          {
            title: {
              [Op.iLike]: `%${searchText}%`,
            },
          },
          {
            description: {
              [Op.iLike]: `%${searchText}%`,
            },
          },
        ],
      },
    });
    res.status(200).send(events);
  } catch (e) {
    return res.status(500).send({ message: "Something went wrong, sorry" });
  }
});

// GET all sounds of a given category
router.get("/category/:id", async (req, res, next) => {
  const categoryId = parseInt(req.params.id);
  if (!categoryId) {
    return res.status(400).send("Category ID hasn't been found");
  }
  try {
    const categoryEvents = await Category.findAll({
      include: [{ model: Event }],
      where: { id: categoryId },
    });
    res.status(200).send(categoryEvents);
  } catch (e) {
    return res.status(500).send({ message: "Something went wrong, sorry" });
  }
});

module.exports = router;
