import { IsNotEmpty, IsString } from 'class-validator';

export class UserDetailsDto {

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    bio: string;

    constructor(username: string, bio: string) {
        this.username = username;
        this.bio = bio;
    }
}