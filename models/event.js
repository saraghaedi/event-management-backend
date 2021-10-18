"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class event extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      event.belongsTo(models.space);
      event.belongsToMany(models.user, {
        through: "userAttendances",
        foreignKey: "eventId",
      });
      event.belongsToMany(models.category, {
        through: "eventCategory",
        foreignKey: "eventId",
      });
    }
  }
  event.init(
    {
      title: { type: DataTypes.STRING, allowNull: false },
      description: { type: DataTypes.TEXT, allowNull: false },
      imageUrl: DataTypes.STRING,
      start_date: { type: DataTypes.DATE, allowNull: false },
      end_date: { type: DataTypes.DATE, allowNull: false },
      capacity: { type: DataTypes.INTEGER, allowNull: false },
      is_online: { type: DataTypes.BOOLEAN, allowNull: false },
      location: { type: DataTypes.TEXT, allowNull: false },
      price: { type: DataTypes.INTEGER, allowNull: false },
    },
    {
      sequelize,
      modelName: "event",
    }
  );
  return event;
};
