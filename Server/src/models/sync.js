import inventorySchema from "./Inventory.model.js";
import InventoryMovementSchema from "./inventoryMovementSchema.js";
import NotificationSchema from "./notifications.model.js";
import warehouseSchema from "./warehouse.model.js";

(async () => {
  try {
    await NotificationSchema.sync({ force: true });
    console.log("Todas las tablas se han creado correctamente en el orden adecuado.", NotificationSchema);
  } catch (error) {
    console.error("Error al crear las tablas:", error);
  }
})();