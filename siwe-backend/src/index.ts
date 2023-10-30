import "reflect-metadata";
import Session from 'express-session';
import express from 'express';
import { connectToDb, SEQUELIZE } from './infrastructure/orm/sequelize-connection-service';
import { useExpressServer } from 'routing-controllers';
import { syncOrm } from './infrastructure/orm/sync-orm-service';
const SequelizeStore = require("connect-session-sequelize")(Session.Store);

const SESSION_CHECK_EXPIRATION_INTERVAL = Number(process.env.SESSION_CHECK_EXPIRATION_INTERVAL_MINUTES) * 60 * 1000;
const SESSION_EXPIRATION = Number(process.env.SESSION_EXPIRATION_MINUTES) * 60 * 1000;

const main = async () => {
    await connectToDb();
    await syncOrm();
    const sequelizeStore = new SequelizeStore({
        db: SEQUELIZE,
        checkExpirationInterval: SESSION_CHECK_EXPIRATION_INTERVAL,
        expiration: SESSION_EXPIRATION
    });
    await sequelizeStore.sync();
    const app = express();
    app.use(
        Session({
            secret: process.env.SESSION_SECRET,
            store: sequelizeStore,
            saveUninitialized: true,
            resave: false, // we support the touch method so per the express-session docs this should be set to false
            proxy: false,
            cookie: {secure: false, sameSite: true, httpOnly: true}
        })
    );
    useExpressServer(app, {
        controllers: [`${__dirname}/interfaces/**/*`],
        defaultErrorHandler: false,
    });
    app.listen(8000, () => {
        console.log('SIWE backend started!');
    });
}
main();