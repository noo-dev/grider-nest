import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { UsersService } from "./users.service";
import { scrypt as _scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scrypt = promisify(_scrypt)

@Injectable()
export class AuthService {
    constructor(
        private readonly userServie: UsersService
    ) {}

    async signup(email: string, password: string) {
        // see if email in use
        const checkingUser = await this.userServie.findOneBy(email)
        if (checkingUser) {
            throw new BadRequestException('email is already in use')
        }
        // salt and hash user password
        const salt = randomBytes(8).toString('hex')
        const hash = (await scrypt(password, salt, 32)) as Buffer

        const resultPass = salt + '.' + hash.toString('hex')

        // create a new user and save it
        const user = await this.userServie.create(email, resultPass)

        // return user
        return user
    }

    async signin(email: string, password: string) {
        
        const user = await this.userServie.findOneBy(email)

        if (!user) {
            throw new NotFoundException('user not found')
        }

        const [salt, storedHash] = user.password.split('.')
        const hash = (await scrypt(password, salt, 32)) as Buffer;

        if (storedHash !== hash.toString('hex')) {
            throw new BadRequestException('bad password');
        }

        return user;
    }
}