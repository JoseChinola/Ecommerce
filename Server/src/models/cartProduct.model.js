import { DataTypes } from "sequelize";
import { sequelize } from "../Db.js";


const cartProductSchema = sequelize.define('cartProduct', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    productId: {
        type: DataTypes.UUID,
        references: {
            model: 'product', // Relación con el modelo de Product
            key: "_id",
        },
        allowNull: false, // No permitir valores nulos en productId
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
          key: '_id', // ✅ CORREGIDO: Ahora hace referencia a `_id`
        }
      }
      ,
    createdAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Sequelize manejará este campo automáticamente
    },
    updatedAt: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW, // Sequelize manejará este campo automáticamente
    }
}, {
    tableName: 'cartProduct',
    timestamps: true, // Activar los timestamps automáticos
});

// Sincronizar la tabla


export default cartProductSchema;
