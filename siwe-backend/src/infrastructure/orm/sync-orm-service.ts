import { UserOrm } from './user-orm';

export const syncOrm = async () => {
    await UserOrm.sync();
};