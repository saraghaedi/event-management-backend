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
          imageUrl:
            "https://images.prismic.io/codaisseur-test/83243047-4a98-445e-b3ed-379f0ee1a17d_DSC01805.JPG?auto=compress,format&rect=56,0,1124,823&w=280&h=205&w=560&h=270",
          start_date: new Date(),
          end_date: new Date(),
          capacity: 20,
          is_online: false,
          location: "Naritaweg 106, 1043 CA Amsterdam",
          spaceId: 1,
          price: 20,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "codaisseur Virtual Hiring event",
          description:
            "To accommodate companies looking for Junior Developer Talent we organize Virtual Hiring Events where you get to meet multiple talented developers in just 1 day!",
          imageUrl:
            "https://images.prismic.io/codaisseur-test/298a1e88-eca2-4db3-abf3-72347310b487_DSC02996.jpg?auto=compress,format&rect=273,0,5463,4000&w=280&h=205&w=560&h=270",
          start_date: new Date(),
          end_date: new Date(),
          capacity: 10,
          is_online: true,
          location: "Skype",
          spaceId: 1,
          price: 10,
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
