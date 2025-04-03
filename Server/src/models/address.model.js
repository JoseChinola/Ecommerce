import { DataTypes } from "sequelize";
import { sequelize } from "../Db.js";
import userSchema from "./user.model.js";

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
        allowNull: true,
    },
    status: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false, // 🔹 Evita valores nulos para claves foráneas
        references: {
            model: "users",
            key: "_id"
        }
    },
}, {
    tableName: 'address',
    timestamps: true,
});



export default addressSchema;
