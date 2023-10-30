export class UserDetailsDto {
    username: string;
    bio: string;

    constructor(username: string, bio: string) {
        this.username = username;
        this.bio = bio;
    }
}
