const { Router } = require("express");
const authMiddleware = require("../auth/middleware");
const Event = require("../models").event;
const Space = require("../models").space;
const UserAttendance = require("../models").userAttendance;

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

    console.log("im here 0");

    const nrOfTickets = Array.from("x".repeat(amount));
    // const promises = nrOfTickets.map(async (x) => {
    //   return await UserAttendance.create({
    //     userId,
    //     eventId,
    //   });
    // });
    const results = [];

    for (i = 0; i < amount; i++) {
      results.push(
        await UserAttendance.create({
          userId,
          eventId,
        })
      );
    }

    console.log("im here");

    // await Promise.all(promises);

    const ticketsForEvent = await UserAttendance.findAll({
      where: { userId, eventId },
      include: [Event],
    });
    console.log("im here 2");

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
module.exports = router;
