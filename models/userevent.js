"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class userEvent extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      userEvent.belongsTo(models.event);
      userEvent.belongsTo(models.user);
    }
  }
  userEvent.init(
    {
      eventId: { type: DataTypes.INTEGER, allowNull: false },
      userId: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "userEvent",
    }
  );
  return userEvent;
};
