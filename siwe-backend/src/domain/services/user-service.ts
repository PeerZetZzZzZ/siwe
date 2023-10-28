import { UserDetailsDto } from '../../interfaces/dto/user-details-dto';
import { UserOrm } from '../../infrastructure/orm/user-orm';
import { UserDetailsSaveResult } from '../model/user-details-save-result';
import { Model, UniqueConstraintError } from 'sequelize';

export const getUserDetails = async (userAddress: string): Promise<UserDetailsDto | undefined> => {
    const userOrm = await UserOrm.findOne({where: {address: userAddress}});
    return userOrm ? new UserDetailsDto(<string>userOrm.get('username'), <string>userOrm.get('bio')) : undefined;
}

export const createOrUpdateUserDetails = async (userAddress: string, createUserDto: UserDetailsDto): Promise<UserDetailsSaveResult> => {
    try {
        const [instance] = await UserOrm.upsert({
            address: userAddress,
            username: createUserDto.username.trim(),
            bio: createUserDto.bio.trim(),
        });
        return wasUserDetailsInserted(instance) ? UserDetailsSaveResult.CREATED : UserDetailsSaveResult.UPDATED;
    } catch (err) {
        if (err instanceof UniqueConstraintError) {
            return UserDetailsSaveResult.USERNAME_NOT_UNIQUE;
        }
        throw err;
    }
}

const wasUserDetailsInserted = (instance: Model<any, any>): boolean => {
    const createdAt = <Date>instance.get('createdAt');
    const updatedAt = <Date>instance.get('updatedAt');
    return createdAt.getTime() === updatedAt.getTime();
}
