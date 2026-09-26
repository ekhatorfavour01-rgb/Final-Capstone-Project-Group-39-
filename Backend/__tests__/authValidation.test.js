const {
    validateLogin,
    validateProfileUpdate,
    validateRegister,
} = require('../Validations/authValidation');

describe('auth request validation', () => {
    test('accepts a valid registration without allowing a caller-selected role', () => {
        expect(validateRegister({
            name: 'Alex Example',
            email: 'alex@example.com',
            password: 'secure-password',
        })).toEqual([]);
    });

    test('rejects invalid registration fields and attempted role assignment', () => {
        expect(validateRegister({
            name: 'A',
            email: 'not-an-email',
            password: 'short',
            role: 'admin',
        })).toEqual(expect.arrayContaining([
            'Name must be between 2 and 80 characters.',
            'A valid email address is required.',
            'Password must be between 8 and 128 characters.',
            'Only name, email, and password may be provided.',
        ]));
    });

    test('requires email and password for login', () => {
        expect(validateLogin({ email: 'bad', password: '' })).toEqual([
            'A valid email address is required.',
            'Password is required.',
        ]);
    });

    test('permits profile updates only for name and email', () => {
        expect(validateProfileUpdate({ name: 'New Name' })).toEqual([]);
        expect(validateProfileUpdate({ role: 'admin' })).toContain('Only name and email may be updated.');
        expect(validateProfileUpdate({})).toContain('Provide at least one profile field to update.');
    });

    test('rejects non-object request payloads', () => {
        expect(validateRegister(null)).toEqual(['Request body must be a JSON object.']);
        expect(validateProfileUpdate([])).toEqual(['Request body must be a JSON object.']);
    });
});
