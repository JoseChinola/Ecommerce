import { DataTypes } from "sequelize";
import { sequelize } from "../Db.js";
import productSchema from "./product.model.js";
import categorySchema from "./category.model.js";


const storeSchema = sequelize.define('Store', {
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
        references: {
            model: productSchema,
            key: "_id",
        },
        allowNull: false,
    },
    categoryId: {
        type: DataTypes.UUID,
        references: {
            model: categorySchema,
            key: "_id",
        },
        allowNull: true,
    },
    stock: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
        allowNull: false,
    },
    maxStock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 100, // Puedes definir un valor por defecto
        validate: {
            min: 1, // No puede ser menor a 1
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    }
}, {
    tableName: 'store',
    timestamps: true,
});

export default storeSchema;