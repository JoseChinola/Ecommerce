import { DataTypes } from "sequelize";
import { sequelize } from "../Db.js";
import userSchema from "./user.model.js";
import productSchema from "./product.model.js";
import addressSchema from "./address.model.js";


const orderSchema = sequelize.define(
  "order",
  {
    _id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    userId: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "_id",
      },
      allowNull: true,
    },
    productId: {
      type: DataTypes.UUID,
      references: {
        model: "product",
        key: "_id",
      },
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    product_details: {
      type: DataTypes.TEXT,
      defaultValue: '{}',
      get() {
        const rawValue = this.getDataValue('product_details');
        return JSON.parse(rawValue);
      },
      set(value) {
        this.setDataValue('product_details', JSON.stringify(value));
      }
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
    discount: {
      type: DataTypes.FLOAT,
      defaultValue: 0,
      allowNull: false,  // No permite que sea null
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

orderSchema.belongsTo(productSchema, {
  foreignKey: 'productId',
  targetKey: '_id',
  as: 'product'
});

orderSchema.belongsTo(addressSchema, {
  foreignKey: 'deliveryAddress',
  targetKey: '_id',
  as: 'address'
});

// orderSchema.belongsTo(userSchema, {
//   foreignKey: 'userId',
//   targetKey: '_id',
//   as: 'users'
// });

export default orderSchema