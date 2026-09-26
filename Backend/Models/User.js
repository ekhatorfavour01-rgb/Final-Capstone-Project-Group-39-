const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Name is required.'],
            trim: true,
            minlength: [2, 'Name must be at least 2 characters long.'],
            maxlength: [80, 'Name must be 80 characters or fewer.'],
        },
        email: {
            type: String,
            required: [true, 'Email is required.'],
            unique: true,
            lowercase: true,
            trim: true,
            maxlength: [254, 'Email must be 254 characters or fewer.'],
            match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'A valid email address is required.'],
        },
        password: {
            type: String,
            required: [true, 'Password is required.'],
            minlength: [8, 'Password must be at least 8 characters long.'],
            select: false,
        },
        role: {
            type: String,
            enum: ['user', 'admin'],
            default: 'user',
            immutable: true,
        },
    },
    {
        timestamps: true,
        toJSON: {
            transform(_document, returnedObject) {
                delete returnedObject.password;
                delete returnedObject.__v;
                return returnedObject;
            },
        },
    }
);

userSchema.pre('save', async function hashPassword() {
    if (!this.isModified('password')) return;
    this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.comparePassword = function comparePassword(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.models.User || mongoose.model('User', userSchema);