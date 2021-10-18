const bcrypt = require("bcrypt");
const { Router } = require("express");
const { toJWT } = require("../auth/jwt");
const authMiddleware = require("../auth/middleware");
const User = require("../models/").user;
const Space = require("../models").space;
const Event = require("../models").event;
const { SALT_ROUNDS } = require("../config/constants");
const UserAttendance = require("../models").userAttendance;

const router = new Router();

router.post("/login", async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .send({ message: "Please provide both email and password" });
    }

    const user = await User.findOne({
      where: { email },
      include: [{ model: Space, include: [Event] }],
    });

    const userEvents = await UserAttendance.findAll({
      where: { userId: user.id },
      include: [Event],
    });

    // console.log(userEvents.map((e) => e.toJSON()));

    const cleanUpEvents = userEvents.map((e) => e.get({ plain: true }));

    const eventsWithQuantity = cleanUpEvents.reduce((acc, event, index) => {
      const { userId, eventId } = event;

      // check if I already have an event with the same userId + eventId
      // => if I have, increase quantity
      // => if I don't, add to array.

      const isNotIncluded = acc.every(
        (e) => e.eventId !== eventId || e.userId !== userId
      );

      if (index === 1) console.log(eventId, userId, isNotIncluded, acc);

      if (isNotIncluded) {
        return [...acc, { ...event, quantity: 1 }];
      } else {
        const newAcc = acc.map((e) => {
          if (e.eventId === eventId && e.userId === userId) {
            return { ...e, quantity: e.quantity + 1 };
          } else {
            return e;
          }
        });
        return newAcc;
      }
    }, []);

    console.log("eventWithQ", eventsWithQuantity);

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).send({
        message: "User with that email not found or password incorrect",
      });
    }

    delete user.dataValues["password"]; // don't send back the password hash
    const token = toJWT({ userId: user.id });
    return res
      .status(200)
      .send({ token, ...user.dataValues, userEvents: eventsWithQuantity });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Something went wrong, sorry" });
  }
});

router.post("/signup", async (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name) {
    return res.status(400).send("Please provide an email, password, and name");
  }

  try {
    const newUser = await User.create({
      email,
      password: bcrypt.hashSync(password, SALT_ROUNDS),
      name,
    });

    delete newUser.dataValues["password"]; // don't send back the password hash

    const token = toJWT({ userId: newUser.id });

    res.status(201).json({ token, ...newUser.dataValues });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(400)
        .send({ message: "There is an existing account with this email" });
    }

    return res.status(500).send({ message: "Something went wrong, sorry" });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  const space = await Space.findOne({
    where: { userId: req.user.id },
    include: [Event],
  });

  const userEvents = await UserAttendance.findAll({
    where: { userId: req.user.id },
    include: [Event],
  });

  const cleanUpEvents = userEvents.map((e) => e.get({ plain: true }));

  const eventsWithQuantity = cleanUpEvents.reduce((acc, event, index) => {
    const { userId, eventId } = event;

    // check if I already have an event with the same userId + eventId
    // => if I have, increase quantity
    // => if I don't, add to array.

    const isNotIncluded = acc.every(
      (e) => e.eventId !== eventId || e.userId !== userId
    );

    if (index === 1) console.log(eventId, userId, isNotIncluded, acc);

    if (isNotIncluded) {
      return [...acc, { ...event, quantity: 1 }];
    } else {
      const newAcc = acc.map((e) => {
        if (e.eventId === eventId && e.userId === userId) {
          return { ...e, quantity: e.quantity + 1 };
        } else {
          return e;
        }
      });
      return newAcc;
    }
  }, []);

  // don't send back the password hash
  delete req.user.dataValues["password"];
  res
    .status(200)
    .send({ ...req.user.dataValues, space, userEvents: eventsWithQuantity });
});

module.exports = router;
