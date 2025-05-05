import { DataTypes } from "sequelize";
import { sequelize } from "../Db.js";
import categorySchema from "./category.model.js";
import subCategorySchema from "./subCategory.model.js";


// Definir el modelo de Product
const productSchema = sequelize.define('product', {
    _id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    image: {
        type: DataTypes.JSONB,
        defaultValue: [],
        allowNull: false
    },
    unit: {
        type: DataTypes.STRING,
        allowNull: false
    },
    price: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    discount: {
        type: DataTypes.FLOAT,
        defaultValue: 0,
        allowNull: false
    },
    description: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    more_details: {
        type: DataTypes.JSON,
        defaultValue: {},
        allowNull: true
    },
    publish: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        allowNull: false
    }
}, {
    tableName: 'product',
    timestamps: true
});


// Tablas intermedias para las relaciones muchos a muchos
const ProductCategory = sequelize.define('product_category', {}, { timestamps: false });
const ProductSubCategory = sequelize.define('product_subcategory', {}, { timestamps: false });

// Relaciones muchos a muchos
productSchema.belongsToMany(categorySchema, {
    through: ProductCategory,
    foreignKey: 'productId',
    otherKey: 'categoryId',
    as: 'categories'
});

productSchema.belongsToMany(subCategorySchema, {
    through: ProductSubCategory,
    foreignKey: 'productId',
    otherKey: 'subCategoryId',
    as: 'subcategories'
});

categorySchema.belongsToMany(productSchema, {
    through: ProductCategory,
    foreignKey: 'categoryId',
    otherKey: 'productId',
    as: 'products'
});

subCategorySchema.belongsToMany(productSchema, {
    through: ProductSubCategory,
    foreignKey: 'subCategoryId',
    otherKey: 'productId',
    as: 'products'
});



export default productSchema;

