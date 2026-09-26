const User = require('../Models/User');

describe('User model', () => {
    test('defaults accounts to the user role and excludes passwords from JSON', () => {
        const user = new User({
            name: 'Alex Example',
            email: 'alex@example.com',
            password: 'a-hashed-password',
        });

        expect(user.role).toBe('user');
        expect(User.schema.path('password').options.select).toBe(false);
        expect(user.toJSON()).not.toHaveProperty('password');
    });
});
