import { DataTypes } from "sequelize";
import { sequelize } from "../Db.js";
import addressSchema from "./address.model.js";
import cartProducSchema from "./cartProduct.model.js"
import orderSchema from "./order.model.js";


// Definir el modelo de usuario
const userSchema = sequelize.define('users', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    avatar: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    mobile: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    refresh_token: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    verify_email: {
        type: DataTypes.BOOLEAN,
        defaultValue: false
    },
    last_login_date: {
        type: DataTypes.DATE,
        defaultValue: null
    },
    status: {
        type: DataTypes.ENUM('Active', 'Inactive', 'Suspended'),
        defaultValue: 'Active'
    },
    address_details: {
        type: DataTypes.UUID,
        defaultValue: null,
        references: {
            model: "address",
            key: "_id"
        }
    },
    shopping_cart: {
        type: DataTypes.UUID,
        defaultValue: null,
        references: {
            model: "cartProduct",
            key: "_id"
        }
    },
    orderHistory: {
        type: DataTypes.UUID,
        defaultValue: null,
        references: {
            model: "order",
            key: "_id"
        }
    },
    forgot_password_otp: {
        type: DataTypes.STRING,
        defaultValue: null
    },
    forgot_password_expiry: {
        type: DataTypes.DATE,
        defaultValue: null
    },
    role: {
        type: DataTypes.ENUM('ADMIN', 'USER'),
        defaultValue: 'USER'
    },
}, {
    tableName: 'users',
    timestamps: true,
});

// Establecer relaciones con los otros modelos
userSchema.belongsTo(addressSchema, { foreignKey: 'address_details' });
userSchema.belongsTo(cartProducSchema, { foreignKey: 'shopping_cart' });
userSchema.belongsTo(orderSchema, { foreignKey: 'orderHistory' });



export default userSchema;