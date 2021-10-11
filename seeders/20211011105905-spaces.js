"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "spaces",
      [
        {
          title: "codaisseur",
          description:
            "We're an International Academy with the mission to fill the talent gap in tech and champion motivated students into their dream career.",
          logo_url:
            "https://coursereport-s3-production.global.ssl.fastly.net/uploads/school/logo/426/original/codaisseur-square.png",
          createdAt: new Date(),
          updatedAt: new Date(),
          userId: 1,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("spaces", null, {});
  },
};
