import { JwtAdapter, bcryptAdapter } from "../../config";
import { UserModel } from "../../data";
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from "../../domain";

export class AuthService {
    constructor() { }

    public async registerUser(registerUserDto: RegisterUserDto) {

        const existUser = await UserModel.findOne({ email: registerUserDto.email });

        if (existUser) throw CustomError.badRequest('Email alredy exist');

        try {

            const user = new UserModel(registerUserDto);

            user.password = bcryptAdapter.hash(registerUserDto.password);

            await user.save();

            const { password, ...rest } = UserEntity.fromObject(user);

            return { user: rest, token: 'ABC' };

        } catch (error) {
            throw CustomError.internalServer(`${error}`);
        }
    }

    public async loginUser(loginUserDto: LoginUserDto) {

        const user = await UserModel.findOne({ email: loginUserDto.email });

        if (!user) throw CustomError.badRequest('Email not found');

        const isMatch = bcryptAdapter.compare(loginUserDto.password, user.password!);

        if (!isMatch) throw CustomError.badRequest('Password is not valid');

        const { password, ...rest } = UserEntity.fromObject(user);

        const token = await JwtAdapter.generateToken({ id: user.id });

        if (!token) throw CustomError.internalServer('Error jwt');

        return { user: rest, token: token }
    }
}