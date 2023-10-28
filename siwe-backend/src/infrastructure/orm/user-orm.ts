import { DataTypes } from 'sequelize';
import { SEQUELIZE } from './sequelize-connection-service';

const UserOrm = SEQUELIZE.define('user', {
    address: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
    },
    username: {
        type: DataTypes.TEXT,
        allowNull: false,
        unique: true,
    },
    bio: {
        type: DataTypes.TEXT,
        allowNull: false
    },
});

export {
    UserOrm,
}