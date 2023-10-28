import { IsNotEmpty, IsString } from 'class-validator';

export class SiweLoginDto {

    @IsNotEmpty()
    @IsString()
    message: string;

    @IsNotEmpty()
    @IsString()
    signature: string;

    constructor(message: string, signature: string) {
        this.message = message;
        this.signature = signature;
    }
}