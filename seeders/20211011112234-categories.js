"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "categories",
      [
        {
          title: "tech",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "development",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "javascript",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("categories", null, {});
  },
};
