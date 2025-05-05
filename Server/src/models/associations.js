import warehouseSchema from './warehouse.model.js';
import productSchema from './product.model.js';
import inventorySchema from './Inventory.model.js';
import InventoryMovementSchema from './inventoryMovementSchema.js';
import userSchema from './user.model.js';
import orderSchema from './order.model.js';


// 1. asociaciones de producto a inventario
inventorySchema.belongsTo(productSchema, { foreignKey: 'productId', as: 'product' })

// 1. asociaciones de producto a inventario
productSchema.hasMany(inventorySchema, {
  foreignKey: 'productId',
  as: 'inventories'
});

// 1. asociaciones de inventario a usuario
inventorySchema.belongsTo(userSchema, {
  foreignKey: 'userId',
  as: 'user'
});

// 2. asociaciones de inventario a almacén

warehouseSchema.hasMany(inventorySchema, {
  foreignKey: 'warehouseId',
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


// Orders
orderSchema.belongsTo(userSchema, { foreignKey: 'userId' });



console.log('🤝 Relaciones configuradas');