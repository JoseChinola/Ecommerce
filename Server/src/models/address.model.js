import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "../Db.js";

// Definir el modelo de Address
const addressSchema = sequelize.define('address', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    address_line: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    city: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    state: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    pincode: {
        type: DataTypes.STRING,
    },
    country: {
        type: DataTypes.STRING,
    },
    mobile: {
        type: DataTypes.STRING,
        defaultValue: null,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
}, {
    tableName: 'address',
    timestamps: true,
});


export default addressSchema;
