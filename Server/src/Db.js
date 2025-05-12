import dotenv from 'dotenv'
dotenv.config()
import Sequelize from 'sequelize';
import tedious from 'tedious'


export const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DBA_HOST,
    dialect: 'mssql',
    dialectModule: tedious,
    logging: false,
});

export const getConnection = async () => {
    try {
        await sequelize.authenticate();
        console.log(`Conexión a la base de datos >> ${process.env.DB_NAME} << establecida con éxito.`);
        return sequelize
    } catch (error) {
        console.error('No se pudo conectar a la base de datos:', error);
        throw error;
    }
};