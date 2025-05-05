import { DataTypes } from "sequelize";
import { sequelize } from "../Db.js";
import warehouseSchema from "./warehouse.model.js";
import productSchema from "./product.model.js";


const inventorySchema = sequelize.define('inventory', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    warehouseId: {
        type: DataTypes.UUID,
        defaultValue: null,
        references: {
            model: "warehouse",
            key: "_id"
        }
    },
    productId: {
        type: DataTypes.UUID,
        defaultValue: null,
        references: {
            model: "product",
            key: "_id"
        }
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false,
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "users",
            key: "_id"
        }
    },
    stock: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            max: {
                args: [1000],
                msg: "El stock no puede ser mayor a 1000 unidades."
            },
            min: {
                args: [0],
                msg: "El stock no puede ser negativo."
            }
        }
    }
}, {
    tableName: 'inventory',
    timestamps: true,
});


inventorySchema.belongsTo(warehouseSchema, {
    foreignKey: 'warehouseId',
    as: 'warehouse'
});



export default inventorySchema;