import { DataTypes } from "sequelize";
import { sequelize } from "../Db.js";

const warehouseSchema = sequelize.define('warehouse ',
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    address: {
      type: DataTypes.STRING,
      defaultValue: "",
    },
    status: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  }, {
  tableName: 'warehouse',
  timestamps: true,
});



export default warehouseSchema;