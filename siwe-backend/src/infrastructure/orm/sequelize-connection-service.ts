import { Sequelize } from 'sequelize';

export const SEQUELIZE = new Sequelize(`postgres://${process.env.DB_USER}:${process.env.DB_PASSWORD}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`) // Example for postgres
export const connectToDb = async () => {
    try {
        await SEQUELIZE.authenticate();
        console.log('Connection to DB has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to DB:', error);
        throw error;
    }
};