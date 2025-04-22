import storeSchema from "./store.model.js";
import productSchema from "./product.model.js";

// Relación: un store pertenece a un producto
storeSchema.belongsTo(productSchema, {
  foreignKey: "productId",
  as: "product",
});

productSchema.hasMany(storeSchema, {
  foreignKey: "productId",
  as: "stores",
});

console.log("Relaciones cargadas correctamente");