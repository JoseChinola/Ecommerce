import { DataTypes } from "sequelize";
import { sequelize } from "../Db.js";

const InventoryMovementSchema = sequelize.define('inventoryMovement', {
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    productId: {
        type: DataTypes.UUID,
        defaultValue: null,
        references: {
            model: "product",
            key: "_id"
        }
    },
    warehouseId: {
        type: DataTypes.UUID,
        defaultValue: null,
        references: {
            model: "warehouse",
            key: "_id"
        }
    },
    type: {
        type: DataTypes.ENUM('entrada', 'salida'),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    userId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "users",
            key: "_id"
        }
    },
    date: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW
    }
}, {
    tableName: 'inventoryMovement',
    timestamps: true,
});



export default InventoryMovementSchema;