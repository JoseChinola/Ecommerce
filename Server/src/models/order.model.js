
import { DataTypes } from "sequelize";
import { sequelize } from "../Db.js";


const orderSchema = sequelize.define(
    "order",
    {
      _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,  // Usamos UUIDV4 para generación de UUID
        primaryKey: true,
      },
      userId: {
        type: DataTypes.UUID,
        references: {
          model: "users",  // Nombre de la tabla relacionada
          key: "_id",      // Clave primaria en la tabla relacionada
        },
        allowNull: true,
      },
      orderId: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      productId: {
        type: DataTypes.UUID,
        references: {
          model: "product",  // Nombre de la tabla relacionada
          key: "_id",        // Clave primaria en la tabla relacionada
        },
      },
      product_details: {
        type: DataTypes.TEXT,  // Usamos TEXT en lugar de JSON
        defaultValue: '{}',    // Almacenamos el JSON como cadena de texto
      },
      paymentId: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      paymentStatus: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
      deliveryAddress: {
        type: DataTypes.UUID,
        references: {
          model: "address",  // Nombre de la tabla relacionada
          key: "_id",        // Clave primaria en la tabla relacionada
        },
      },
      subTotalAmt: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      totalAmt: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
      },
      invoice_receipt: {
        type: DataTypes.STRING,
        defaultValue: "",
      },
    },
    {
      tableName: "order",
      timestamps: true,  // Esto permitirá las columnas createdAt y updatedAt
    }
  );

// await orderSchema.sync({ force: true });

export default orderSchema