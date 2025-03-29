import Sequelize from 'sequelize';
import tedious from 'tedious'
import { DB_NAME, DB_PASSWORD, DB_USER } from './config.js';


export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mssql',
    dialectModule: tedious,
    logging: false,
});

export const getConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log(`Conexión a la base de datos >> ${DB_NAME} << establecida con éxito.`);
        return sequelize
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
        throw error;
    }
};