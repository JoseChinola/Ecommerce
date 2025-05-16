import { Op, Sequelize } from 'sequelize';
import orderSchema from '../models/order.model.js';
import userSchema from '../models/user.model.js';
import productSchema from '../models/product.model.js';
import addressSchema from '../models/address.model.js';
import categorySchema from '../models/category.model.js';


export const getDashboardController = async (req, res) => {
    try {
        // 1) Stats básicos
        const totalSales = await orderSchema.sum('totalAmt', {
            where: {
                orderStatus: { [Op.ne]: 'Cancelada' },
                paymentStatus: 'Paid'
            }
        });
        const totalOrders = await orderSchema.count({
            where: {
                orderStatus: { [Op.ne]: 'Cancelada' },
                paymentStatus: 'Paid'
            }
        });
        const totalClients = await userSchema.count({ where: { role: { [Op.ne]: 'ADMIN' } } });

        const totalProducts = await productSchema.count();

        // 2) Distribución por país
        const cityDistribution = await addressSchema.findAll({
            attributes: [
                'city',
                [Sequelize.fn('COUNT', Sequelize.col('city')), 'percentage']
            ],
            group: ['city'],
            raw: true
        });

        // 3) Ventas e ingresos por mes en 2025
        const monthlyRaw = await orderSchema.findAll({
            attributes: [
                [Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'month'],
                [Sequelize.fn('SUM', Sequelize.col('totalAmt')), 'sales'],
                [Sequelize.fn('SUM', Sequelize.col('totalAmt')), 'revenue'],
            ],
            where: {
                createdAt: {
                    [Op.between]: [new Date('2025-01-01'), new Date('2025-12-31')]
                },
                orderStatus: { [Op.ne]: 'Cancelada' },
                paymentStatus: 'Paid'
            },
            group: [Sequelize.fn('MONTH', Sequelize.col('createdAt'))],
            order: [[Sequelize.fn('MONTH', Sequelize.col('createdAt')), 'ASC']],
            raw: true
        });

        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const monthlyData = {
            labels: monthlyRaw.map(r => monthNames[r.month - 1]),
            sales: monthlyRaw.map(r => parseFloat(r.sales).toFixed(2)),
            revenue: monthlyRaw.map(r => parseFloat(r.revenue).toFixed(2)),
        };

        // 4) Últimos 5 pedidos (timeline)
        const timeline = await orderSchema.findAll({
            attributes: ['orderId', 'totalAmt', 'paymentStatus', 'createdAt'],
            order: [['createdAt', 'DESC']],
            where: {
                orderStatus: { [Op.ne]: 'Cancelada' }
            },
            raw: true
        });

        // 5) Top 5 productos más vendidos
        // 1. Contar ventas por productId y quedarnos con los 5 primeros
        const topCounts = await orderSchema.findAll({
            attributes: [
                'productId',
                [Sequelize.fn('COUNT', Sequelize.col('productId')), 'salesCount']
            ],
            where: {
                orderStatus: { [Op.ne]: 'Cancelada' },
                paymentStatus: 'Paid'
            },
            group: ['productId'],
            order: [[Sequelize.literal('salesCount'), 'DESC']],
            limit: 5,
            raw: true
        });
        // 2. Extraer sólo los IDs
        const productIds = topCounts.map(r => r.productId);

        // 3. Buscar los productos en una sola query
        const products = await productSchema.findAll({
            where: { _id: productIds },
            attributes: ['_id', 'name'],
            raw: true
        });

        const topProducts = topCounts.map(({ productId, salesCount }) => {
            const prod = products.find(p => p._id === productId) || {};
            return {
                productId,
                productName: prod.name || '–',
                salesCount: parseInt(salesCount, 10)
            };
        });

        // 6) Ventas semanales
        // Mapeo de iconos por categorías
        const iconKeyMap = {
            Textiles: "textiles",
            Carpa: "carpa",
            Mobiliario: "mobiliario",
            Decoración: "decoracion",
        };

        // Consulta de ventas semanales por categoría
        const weeklySalesByCategoryRaw = await orderSchema.findAll({
            attributes: [
                [Sequelize.literal("DATEPART(WEEK, [order].[createdAt])"), "week"],
                [Sequelize.col("product.categories._id"), "categoryId"],    // Incluye _id
                [Sequelize.col("product.categories.name"), "category"],
                [Sequelize.fn("SUM", Sequelize.col("totalAmt")), "sales"],
            ],
            include: [{
                model: productSchema, as: "product", attributes: [],
                include: [{
                    model: categorySchema, as: "categories",
                    attributes: ["_id", "name"],      // Incluye _id y name
                    through: { attributes: [] },
                    required: true
                }]
            }],
            where: {
                createdAt: {
                    [Op.between]: [new Date("2025-01-01"), new Date("2025-12-31")]
                },
                orderStatus: { [Op.ne]: 'Cancelada' },
                paymentStatus: 'Paid'
            },
            group: [
                Sequelize.literal("DATEPART(WEEK, [order].[createdAt])"),
                Sequelize.col("product.categories._id"),    // Agrupar por _id
                Sequelize.col("product.categories.name")    // Agrupar por nombre
            ],
            order: [
                [Sequelize.literal("DATEPART(WEEK, [order].[createdAt])"), "ASC"],
                [Sequelize.col("product.categories.name"), "ASC"]
            ],
            raw: true
        });

        // Procesamiento de ventas semanales por categoría
        const weeklySalesByCategory = weeklySalesByCategoryRaw.reduce((acc, curr) => {
            const weekLabel = `semana ${curr.week}`;
            if (!acc[weekLabel]) acc[weekLabel] = {};
            acc[weekLabel][curr.category] = (acc[weekLabel][curr.category] || 0) + parseFloat(curr.sales);
            return acc;
        }, {});

        // Formatear los datos para Recharts
        const weeklySales = Object.entries(weeklySalesByCategory).map(([week, cats]) => {
            // Generar el objeto 'icons' para cada semana
            const icons = Object.keys(cats).reduce((o, catName) => {
                // Mapeo de categorías con el icono correspondiente
                o[catName] = iconKeyMap[catName] || catName.toLowerCase(); // Usar el valor de iconKeyMap o el nombre en minúsculas
                return o;
            }, {});

            return {
                name: week,
                ...cats,  // Agregar las ventas por categoría
                icons     // Agregar los iconos para las categorías
            };
        });

        // Montamos la respuesta
        return res.json({
            message: "Datos del panel recuperados correctamente",
            error: false,
            success: true,
            data: {
                stats: [
                    { title: 'Ventas', value: parseFloat(totalSales).toFixed(2), color: 'bg-green-100 text-green-600', iconName: 'FaDollarSign' },
                    { title: 'Pedidos', value: totalOrders, color: 'bg-blue-100 text-blue-600', iconName: 'FaShoppingCart' },
                    { title: 'Clientes', value: totalClients, color: 'bg-orange-300 text-purple-600', iconName: 'FaUsers' },
                    { title: 'Productos', value: totalProducts, color: 'bg-yellow-100 text-yellow-600', iconName: 'FaBoxOpen' }
                ],
                cityDistribution,
                timeline,
                monthlyData,
                topProducts,
                weeklySales
            }
        });

    } catch (error) {
        console.error("Error en getDashboardController:", error);
        return res.status(500).json({
            message: error.message || "Internal Server Error",
            error: true,
            success: false
        });
    }
};
