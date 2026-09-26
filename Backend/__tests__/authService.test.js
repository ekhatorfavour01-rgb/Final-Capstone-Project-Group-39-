process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/auth-test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'auth-test-secret';
process.env.PORT = process.env.PORT || '3000';

jest.mock('../Models/User', () => ({
    create: jest.fn(),
    findOne: jest.fn(),
}));
jest.mock('../Utils/generateToken', () => jest.fn(() => 'signed-token'));

const User = require('../Models/User');
const generateToken = require('../Utils/generateToken');
const authService = require('../Services/authService');

describe('auth service', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('registers normalized account details and issues a token', async () => {
        const user = { id: 'user-123', role: 'user' };
        User.findOne.mockResolvedValue(null);
        User.create.mockResolvedValue(user);

        await expect(authService.register({
            name: ' Alex Example ',
            email: ' ALEX@EXAMPLE.COM ',
            password: 'secure-password',
        })).resolves.toEqual({ user, token: 'signed-token' });

        expect(User.create).toHaveBeenCalledWith({
            name: 'Alex Example',
            email: 'alex@example.com',
            password: 'secure-password',
        });
        expect(generateToken).toHaveBeenCalledWith('user-123', 'user');
    });

    test('rejects registration when the email is already registered', async () => {
        User.findOne.mockResolvedValue({ id: 'existing-user' });

        await expect(authService.register({
            name: 'Alex Example',
            email: 'alex@example.com',
            password: 'secure-password',
        })).rejects.toMatchObject({ statusCode: 409 });
        expect(User.create).not.toHaveBeenCalled();
    });

    test('returns a token only when the password matches', async () => {
        const user = {
            id: 'user-123',
            role: 'user',
            comparePassword: jest.fn().mockResolvedValue(true),
        };
        User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(user) });

        await expect(authService.login({
            email: ' ALEX@EXAMPLE.COM ',
            password: 'secure-password',
        })).resolves.toEqual({ user, token: 'signed-token' });

        expect(User.findOne).toHaveBeenCalledWith({ email: 'alex@example.com' });
        expect(user.comparePassword).toHaveBeenCalledWith('secure-password');
    });

    test('uses the same unauthorized response for unknown email and wrong password', async () => {
        User.findOne.mockReturnValue({ select: jest.fn().mockResolvedValue(null) });

        await expect(authService.login({
            email: 'unknown@example.com',
            password: 'incorrect-password',
        })).rejects.toMatchObject({
            message: 'Invalid email or password.',
            statusCode: 401,
        });
    });
});
