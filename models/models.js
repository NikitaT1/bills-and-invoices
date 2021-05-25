import sequelize from "../db";
import { DataTypes } from "sequelize";

export const Customer = sequelize.define("customer", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
});

export const Recipient = sequelize.define("recipient", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING },
  recipientsCompany: { type: DataTypes.STRING },
});

export const Bill = sequelize.define("bill", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  recipientId: { type: DataTypes.INTEGER },
  customerId: { type: DataTypes.INTEGER },
});

export const Works = sequelize.define("work", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  billId: { type: DataTypes.INTEGER },
  workPerformed: { type: DataTypes.STRING },
  price: { type: DataTypes.INTEGER },
});

Customer.hasMany(Recipient);
Recipient.belongsTo(Customer);

Bill.hasMany(Works);
Works.belongsTo(Bill);

Recipient.hasMany(Bill);
Bill.belongsTo(Recipient);
