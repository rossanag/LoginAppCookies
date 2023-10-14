import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
        minlength: [8, 'Name must be at least 8 characters long'],
        maxlength: [30, 'Name must be less than 30 characters long']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        match: [/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/, 'Invalid email address']
    },    
    picture: {
        type: String,
        required: false      
    },    
    authMode: {
        type: String,
        enum: ['google', 'local'],
        default: 'local'
    },
    refreshToken: {
        type: String,        
        required: true
    },    
});

// Compare the given password with the hashed password in the database
UserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', UserSchema);

export default User;

