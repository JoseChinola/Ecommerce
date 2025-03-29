import cartProductSchema from "./cartProduct.model.js";
import orderSchema from "./order.model.js";
import userSchema from "./user.model.js";

(async () => {
  try {
   // Primero sincroniza las tablas que no dependen de otras:
    // Primero sincronizamos la tabla de usuarios
    await userSchema.sync({ force: true });
    

    console.log("Todas las tablas se han creado correctamente en el orden adecuado.", userSchema);
  } catch (error) {
    console.error("Error al crear las tablas:", error);
  }
})();