import { DataTypes } from "sequelize";
import { sequelize } from "../Db.js";

const storeSchema = sequelize.define('store', {
  _id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  productId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    allowNull: false,
    validate: {
      max: 1000,
    },
  },
  lastUpdate: {
    type: DataTypes.DATE,
    allowNull: false,
  },
}, {
  tableName: 'store',
  timestamps: true,
});

export default storeSchema;