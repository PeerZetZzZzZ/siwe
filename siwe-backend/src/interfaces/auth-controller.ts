import { Body, Get, HttpCode, JsonController, Post, Put, Req, Res, Session } from 'routing-controllers';
import { generateNonce, SiweMessage } from 'siwe';
import { SiweLoginDto } from './dto/siwe-login-dto';
import { Response } from 'express-serve-static-core';
import { UserDetailsDto } from './dto/user-details-dto';
import { createOrUpdateUserDetails, getUserDetails } from '../domain/services/user-service';
import { UserDetailsSaveResult } from '../domain/model/user-details-save-result';
import { siweLogin } from '../domain/services/siwe-service';
import { StatusCode } from 'status-code-enum'

export type Session = { siwe: SiweMessage, nonce: string };

@JsonController('/api/rest/v1/user')
export class DaoController {

    @Post('/login')
    async login(
            @Res() res: Response,
            @Session() session: any,
            @Body({required: true}) siweLoginDto: SiweLoginDto) {
        const siweResponse = await siweLogin(siweLoginDto.message, siweLoginDto.signature, session.nonce);
        if (siweResponse) {
            session.siwe = siweResponse.data;
            console.log(`Logged in user with address: ${session.siwe.address}`);
            return res.sendStatus(StatusCode.SuccessNoContent);
        } else {
            console.log(`Invalid user login attempt`);
            return res.sendStatus(StatusCode.ClientErrorBadRequest);
        }
    }

    @Post('/logout')
    async logout(
            @Res() res: Response,
            @Session() session: Session) {
        if (session.siwe) {
            const userAddress = session.siwe.address;
            session.siwe = undefined;
            console.log(`Logout user with address: ${userAddress}`);
            return res.sendStatus(StatusCode.SuccessNoContent);
        } else {
            console.log(`Logout failed. User unauthorized`);
            res.sendStatus(StatusCode.ClientErrorUnauthorized);
        }
    }

    @Get('/nonce')
    @HttpCode(StatusCode.SuccessOK)
    async getNonce(@Session() session: Session) {
        session.nonce = generateNonce();
        return {
            nonce: session.nonce,
        }
    }

    @Get('/details')
    async getUserDetails(@Res() res: Response, @Session() session: Session) {
        if (session.siwe) {
            const userDetails: UserDetailsDto | undefined = await getUserDetails(session.siwe.address);
            if (userDetails) {
                console.log(`Returned user details for address: ${session.siwe.address}`);
                return res.status(StatusCode.SuccessOK).send(userDetails);
            } else {
                console.log(`User details for address: ${session.siwe.address} not found`);
                return res.sendStatus(StatusCode.ClientErrorNotFound);
            }
        } else {
            console.log(`Getting user details failed. User unauthorized`);
            return res.sendStatus(StatusCode.ClientErrorUnauthorized);
        }
    }

    @Put('/details')
    async saveUserDetails(
            @Res() res: Response,
            @Session() session: Session,
            @Body({required: true}) createUserDto: UserDetailsDto) {
        if (session.siwe) {
            const result = await createOrUpdateUserDetails(session.siwe.address, createUserDto);
            if (result === UserDetailsSaveResult.CREATED) {
                console.log(`Created user details for address: ${session.siwe.address}`);
                return res.sendStatus(StatusCode.SuccessCreated);
            } else if (result === UserDetailsSaveResult.UPDATED) {
                console.log(`Updated user details for address: ${session.siwe.address}`);
                return res.sendStatus(StatusCode.SuccessNoContent);
            } else if (result === UserDetailsSaveResult.USERNAME_NOT_UNIQUE) {
                console.log(`Updating user details for address ${session.siwe.address} failed. '${createUserDto.username} username is already taken!'`);
                return res.status(StatusCode.ClientErrorBadRequest).send({
                    errorCode: '1',
                    message: UserDetailsSaveResult.USERNAME_NOT_UNIQUE,
                });
            }
        } else {
            console.log(`Saving user details failed. User unauthorized`);
            return res.sendStatus(StatusCode.ClientErrorUnauthorized);
        }
    }

}