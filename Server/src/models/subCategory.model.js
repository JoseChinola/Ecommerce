import { DataTypes } from "sequelize";
import { sequelize } from "../Db.js";

// Importa categorySchema antes de definir subCategorySchema
import categorySchema from "./category.model.js";

const subCategorySchema = sequelize.define('subCategory', {
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
    },
    category: {
        type: DataTypes.UUID,
        allowNull: true,
    },
}, {
    tableName: 'subCategory',
    timestamps: true,
});

subCategorySchema.belongsTo(categorySchema, {
    foreignKey: "category",
    as: "categoryData",  // 📌 IMPORTANTE: Debe coincidir con `include`
});



export default subCategorySchema;
