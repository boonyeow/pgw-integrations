import { DataTypes } from "sequelize";
import { sequelize } from "../db";

const Order = sequelize.define("Order", {
  id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  customerName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  amount: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  currency: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gateway: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  referenceId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  referenceIdType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  gatewayResponse: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
});

export { Order };
