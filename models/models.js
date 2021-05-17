const sequelize = require("../db");
const { DataTypes } = require("sequelize");

const Customer = sequelize.define("customer", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  firstName: { type: DataTypes.STRING },
  lastName: { type: DataTypes.STRING },
  email: { type: DataTypes.STRING },
});

// const RecipientsEmail = sequelize.define("bill", {
//   id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
//   email: { type: DataTypes.STRING },
// });

const Recipient = sequelize.define("recipient", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING },
  recipientsCompany: { type: DataTypes.STRING },
});

const Bill = sequelize.define("bill", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  recipientId: { type: DataTypes.INTEGER },
  customerId: { type: DataTypes.INTEGER },
  // workPerformed: { type: DataTypes.STRING },
  // price: { type: DataTypes.INTEGER },
});

const Works = sequelize.define("work", {
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

module.exports = { Customer, Recipient, Bill, Works };
