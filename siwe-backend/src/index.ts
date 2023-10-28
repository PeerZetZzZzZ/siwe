import "reflect-metadata";
import Session from 'express-session';
import express from 'express';

const SequelizeStore = require("connect-session-sequelize")(Session.Store);
import { connectToDb, SEQUELIZE } from './infrastructure/orm/sequelize-connection-service';
import { useExpressServer } from 'routing-controllers';
import { syncOrm } from './infrastructure/orm/sync-orm-service';

const SESSION_CHECK_EXPIERATION_INTERVAL = 15 * 60 * 1000; // every 15 minutes
const SESSION_EXPIRATION = 60 * 60 * 1000; // 1 hour
const main = async () => {
    await connectToDb();
    await syncOrm();
    const sequelizeStore = new SequelizeStore({
        db: SEQUELIZE,
        checkExpirationInterval: SESSION_CHECK_EXPIERATION_INTERVAL,
        expiration: SESSION_EXPIRATION
    });
    await sequelizeStore.sync();
    const app = express();
    const isProd: boolean = process.env.IS_LOCALHOST !== 'true';
    // app.set('trust proxy', 1);
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
    });
    app.listen(8000, () => {
        console.log('SIWE backend started!');
    });
}
main();