import jwt, { SignOptions } from 'jsonwebtoken';

import { jwtSecret } from '../configs';

const options: SignOptions = {
    // expiresIn: '1h',
    algorithm: 'HS256',
};

export class JwtSrv {
    static sign(payload) {
        return typeof payload === 'string'
            ? jwt.sign(payload, jwtSecret, options)
            : jwt.sign(JSON.stringify(payload), jwtSecret, options);
    }

    static async verify(token) {
        try {
            return  jwt.verify(token, jwtSecret);
        } catch (err) {
            console.error({ errMessage: err.message });
        }
    }
}

