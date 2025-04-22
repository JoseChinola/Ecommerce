import storeSchema from "./store.model.js";


(async () => {
  try {
   // Primero sincroniza las tablas que no dependen de otras:
    // Primero sincronizamos la tabla de usuarios
    await storeSchema.sync({ force: true });
    

    console.log("Todas las tablas se han creado correctamente en el orden adecuado.", storeSchema);
  } catch (error) {
    console.error("Error al crear las tablas:", error);
  }
})();