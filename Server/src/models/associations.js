// associations.js
import userSchema from "./user.model.js";
import cartProductSchema from "./cartProduct.model.js";

// Un usuario puede tener muchos productos en su carrito.
userSchema.hasMany(cartProductSchema, { foreignKey: "userId", as: "shopping_cart" });

// Cada producto en el carrito pertenece a un usuario.
cartProductSchema.belongsTo(userSchema, { foreignKey: "userId", as: "user" });

console.log("Associations defined successfully");
