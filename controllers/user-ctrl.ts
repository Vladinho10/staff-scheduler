import { Request } from 'express';
import moment from 'moment';

import { CustomRequest, CustomResponse } from '../middlewares/respond';
import { UserSrv } from '../services';
import { crypt, objects } from '../helpers';
import { errorMessages } from '../constants';
import { validateEmail } from '../helpers/isEmail';
import db from '../dal/models';

export class UserCtrl {
    static async getManyWhitSchedules(req: CustomRequest, res: CustomResponse) {
        const rangeStartFromQuery = req.query.rangeStart as string;
        const rangeEndFromQuery = req.query.rangeEnd as string;

        const rangeStartDate = moment(rangeStartFromQuery)
            .format('YYYY-MM-DD');
        const rangeEndDate = moment(rangeEndFromQuery)
            .format('YYYY-MM-DD');

        const rangeStartDateMS = new Date(rangeStartDate).getTime();
        const rangeEndDateMS = new Date(rangeEndDate).getTime();

        if (!(rangeStartDateMS < rangeEndDateMS)) {
            return res.badRequest({
                errors: [{
                    message: errorMessages.BAD_REQUEST,
                    description: 'Invalid query',
                }],
            });
        }

        const users = await UserSrv.readUsersWithSchedules();

        return res.send({
            data: users,
            limit: users.length,
        });
    }

    static async getOne(req: CustomRequest, res: CustomResponse) {
        const user = await UserSrv.readOne({ _id: req.params._id });
        if (!user) {
            return res.notFound({
                errors: [{
                    message: errorMessages.NOT_FOUND,
                    description: 'User not found',
                }],
            });
        }

        return res.send({
            data: user,
        });
    }

    static async signUp(req: Request, res: CustomResponse) {
        const { email, firstName, lastName, password } = await req.body;

        if (!email || !firstName || !lastName || !password) {
            return res.badRequest({
                errors: [{
                    message: errorMessages.BAD_REQUEST,
                    description: 'Please fill in empty fields',
                }],
            });
        }

        const isEmail = validateEmail(email);
        if (!isEmail) {
            return res.badRequest({
                errors: [{
                    message: errorMessages.INVALID_EMAIL,
                    description: 'Invalid email',
                }],
            });
        }
        const trimmedPassword = password.trim();

        if (trimmedPassword.length < 6 || trimmedPassword.length > 11) {
            return res.badRequest({
                errors: [{
                    message: errorMessages.MIN_MAX_LENGTH,
                    description: 'Password must be greater 5 and less 12 characters',
                }],
            });
        }

        const user = await db.User.findOne({ where: { email } });

        if (user) {
            return res.badRequest({
                errors: [{
                    message: errorMessages.USER_ALREADY_EXISTS,
                    description: 'Email address already in use',
                }],

            });
        }

        const data = await UserSrv.signUp({
            ...req.body, email, password: trimmedPassword,
        });

        return res.created({
            data,
        });
    }

    static async signIn(req: Request, res: CustomResponse) {
        const { email, password } = await req.body;

        if (!email || !password) {
            return res.badRequest({
                errors: [{
                    message: errorMessages.BAD_REQUEST,
                    description: 'Please fill in empty fields',
                }],
            });
        }
        const hashedPassword = crypt.encrypt(password);
        const user = await db.User.findOne({
            where: { email, password: hashedPassword },
            attributes: { exclude: ['password'] },
        });

        if (!user) {
            return res.notFound({
                errors: [{
                    message: errorMessages.INVALID_CREDENTIALS,
                }],
            });
        }

        const data = await UserSrv.signIn(user);
        return res.send({
            data,
        });
    }

    static async putOne(req: Request, res: CustomResponse) {
        const userId = req.params._id;
        type bodyType = {
            email: string,
            firstName: string,
            lastName: string,
            companyId: string,
        }
        const body = objects.pick(req.body, ['email', 'firstName', 'lastName', 'companyId']) as bodyType;

        const isEmail = validateEmail(body.email);
        if (!isEmail) {
            return res.badRequest({
                errors: [{
                    message: errorMessages.INVALID_EMAIL,
                    description: 'Invalid email',
                }],
            });
        }

        if (body.companyId) {
            const company = await db.Company.findOne({ where: { id: body.companyId } });

            if (!company) {
                return res.notFound({
                    errors: [{
                        message: errorMessages.NOT_FOUND,
                        description: 'Company not found',
                    }],
                });
            }
        }

        const user = await db.User.findOne({ where: { id: userId } });

        if (!user) {
            return res.notFound({
                errors: [{
                    message: errorMessages.NOT_FOUND,
                    description: 'User not found',
                }],
            });
        }
        const updatedUser = await UserSrv.updateOne(user.dataValues.id, body);

        return updatedUser
            ? res.accepted({ data: updatedUser })
            : res.notFound({ errors: [{ message: 'resource not found' }] });
    }

    static async removeOne(req: Request, res: CustomResponse) {
        const isDeleted = await UserSrv.deleteOne(req.params._id);

        return isDeleted ? res.noContent() : res.notFound({ errors: [{ message: 'resource not found' }] });
    }
}
