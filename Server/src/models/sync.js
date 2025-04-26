import inventorySchema from "./Inventory.model.js";
import InventoryMovementSchema from "./inventoryMovementSchema.js";
import warehouseSchema from "./warehouse.model.js";

(async () => {
  try {
    // Primero sincroniza las tablas que no dependen de otras:
    // Primero sincronizamos la tabla de usuarios
    await InventoryMovementSchema.sync({ force: true });
    //await inventorySchema.sync({ force: true });

    console.log("Todas las tablas se han creado correctamente en el orden adecuado.", InventoryMovementSchema);
  } catch (error) {
    console.error("Error al crear las tablas:", error);
  }
})();