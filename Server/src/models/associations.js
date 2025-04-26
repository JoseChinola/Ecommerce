import warehouseSchema from './warehouse.model.js';
import productSchema from './product.model.js';
import inventorySchema from './Inventory.model.js';
import InventoryMovementSchema from './inventoryMovementSchema.js';
import userSchema from './user.model.js';



inventorySchema.belongsTo(productSchema, {
  foreignKey: 'productId',
  as: 'product'
});

inventorySchema.belongsTo(userSchema, {
  foreignKey: 'userId',
  as: 'user'
});

// 2. Asociaciones inversas (opcional)
warehouseSchema.hasMany(inventorySchema, {
  foreignKey: 'warehouseId',
  as: 'inventories'
});
productSchema.hasMany(inventorySchema, {
  foreignKey: 'productId',
  as: 'inventories'
});


// 3. asociaciones de inventario a almacén y producto
InventoryMovementSchema.belongsTo(warehouseSchema, {
  foreignKey: 'warehouseId',
  as: 'warehouse'
});

InventoryMovementSchema.belongsTo(warehouseSchema, {
  foreignKey: 'warehouseId',
  as: 'warehouseData'
});

InventoryMovementSchema.belongsTo(productSchema, {
  foreignKey: 'productId',
  as: 'productData'
});

InventoryMovementSchema.belongsTo(userSchema, {
  foreignKey: 'userId',
  as: 'user'
});


console.log('🤝 Relaciones configuradas');