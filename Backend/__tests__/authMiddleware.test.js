process.env.MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/auth-test';
process.env.JWT_SECRET = process.env.JWT_SECRET || 'auth-test-secret';
process.env.PORT = process.env.PORT || '3000';

jest.mock('../Models/User', () => ({
    findById: jest.fn(),
}));

const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../Config/env');
const User = require('../Models/User');
const authMiddleware = require('../Middleware/authMiddleware');

const createResponse = () => ({
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
});

describe('auth middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('loads the current account for a valid bearer token', async () => {
        const account = { id: 'user-123', role: 'user' };
        const req = {
            headers: { authorization: `Bearer ${jwt.sign({ id: account.id }, JWT_SECRET)}` },
        };
        const res = createResponse();
        const next = jest.fn();
        User.findById.mockResolvedValue(account);

        await authMiddleware(req, res, next);

        expect(User.findById).toHaveBeenCalledWith(account.id);
        expect(req.user).toEqual(account);
        expect(next).toHaveBeenCalledTimes(1);
    });

    test('rejects missing and invalid tokens', async () => {
        const res = createResponse();
        const next = jest.fn();

        await authMiddleware({ headers: {} }, res, next);
        expect(res.status).toHaveBeenCalledWith(401);

        res.status.mockClear();
        await authMiddleware({ headers: { authorization: 'Bearer invalid' } }, res, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(User.findById).not.toHaveBeenCalled();
        expect(next).not.toHaveBeenCalled();
    });
});
