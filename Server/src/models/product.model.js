import { DataTypes } from "sequelize";
import { sequelize } from "../Db.js";
import categorySchema from "./category.model.js";
import subCategorySchema from "./subCategory.model.js";

// Definir el modelo de Product
const productSchema = sequelize.define('product', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,  // Genera UUID de forma automática
        primaryKey: true,
        allowNull: false,  // No permite que sea null
    },
    name: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false,  // No permite que sea null
    },
    image: {
        type: DataTypes.JSONB,  // Permite almacenar arrays u objetos JSON directamente
        defaultValue: [],
        allowNull: false,
    },
    
    subCategoryId: {
        type: DataTypes.UUID,
        references: {
            model: subCategorySchema,
            key: "_id",
        },
        allowNull: true,  // No permite que sea null
    },
    unit: {
        type: DataTypes.STRING,
        defaultValue: "",
        allowNull: false,  // No permite que sea null
    },    
    price: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false,  // No permite que sea null
    },
    discount: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false,  // No permite que sea null
    },
    description: {
        type: DataTypes.TEXT,
        defaultValue: "",
        allowNull: false,  // No permite que sea null
    },
    more_details: {
        type: DataTypes.JSON,  // Usamos STRING (equivalente a NVARCHAR en SQL Server)
        defaultValue: {},  // Almacenamos un objeto JSON vacío como una cadena
        allowNull: true,
    },
    publish: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false,  // No permite que sea null
    }
}, {
    tableName: 'product',
    timestamps: true,
    indexes: [
        {
            name: 'text', 
            type: 'FULLTEXT',
            fields: ['name', 'description'],
        }
    ]
});



// Sincronizar el modelo con la base de datos
productSchema.belongsTo(categorySchema, {
    foreignKey: "categoryId",
    as: "categoryData",
});

productSchema.belongsTo(subCategorySchema, {
    foreignKey: "subCategoryId",
    as: "subcategoryData",
});



export default productSchema;
