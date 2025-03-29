import { DataTypes } from "sequelize";
import { sequelize } from "../Db.js";


// Definir el modelo de Category
const categorySchema = sequelize.define('category', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        defaultValue: "",
    },
    image: {
        type: DataTypes.STRING,
        defaultValue: "",
    }
}, {
    tableName: 'category',
    timestamps: true,
});



export default categorySchema;
