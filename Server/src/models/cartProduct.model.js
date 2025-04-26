import { DataTypes } from "sequelize";
import { sequelize } from "../Db.js";
import productSchema from "./product.model.js";

const cartProductSchema = sequelize.define('cartProduct', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    productId: {
        type: DataTypes.UUID,
        references: {
            model: 'product', // Relación con el modelo de productos
            key: "_id",
        },
        allowNull: false,
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: 'users',
            key: '_id',
        }
    },
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
    }
}, {
    tableName: 'cartProduct',
    timestamps: true,
});


// Sincronizar el modelo con la base de datos
cartProductSchema.belongsTo(productSchema, {
    foreignKey: "productId",
    as: "productData",
});



export default cartProductSchema;