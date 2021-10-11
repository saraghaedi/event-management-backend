"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "events",
      [
        {
          title: "codaisseur live coding event",
          description:
            "We're going to join together and have a really fun coding challenge with lots of prizes!!! Make sure to sign up for the event before deadline!!!",
          imageUrl: "",
          start_date: new Date(),
          end_date: new Date(),
          capacity: 20,
          is_online: false,
          location: "Naritaweg 106, 1043 CA Amsterdam",
          spaceId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "codaisseur Virtual Hiring event",
          description:
            "To accommodate companies looking for Junior Developer Talent we organize Virtual Hiring Events where you get to meet multiple talented developers in just 1 day!",
          imageUrl: "",
          start_date: new Date(),
          end_date: new Date(),
          capacity: 10,
          is_online: true,
          location: "Skype",
          spaceId: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("events", null, {});
  },
};
