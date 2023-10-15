import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const Schema = mongoose.Schema;

//Base for all users
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
    
    refreshToken: {
        type: String,        
        required: true
    },    
});

// Schema for regular users
const regularUserSchema = new mongoose.Schema({
  password: { 
    type: String, 
    required: true },  
});

// Schema for Gmail users
const gmailUserSchema = new mongoose.Schema({
    picture: {
        type: String,
        required: [true, 'Picture is required'],
        validate: {
            validator: function (v) {
                return /^https?:\/\/\S+$/.test(v);
            },
            message: props => `${props.value} is not a valid picture URL!`
        }
    }
  // Fields specific to Gmail users
});

// Discriminator key for distinguishing between user types
const discriminatorKey = 'userType';

// Define the discriminators for different user types
const User = mongoose.model('User', UserSchema);
User.discriminator('RegularUser', regularUserSchema, discriminatorKey, { _id: true });
User.discriminator('GmailUser', gmailUserSchema, discriminatorKey, { _id: true });


// Compare the given password with the hashed password in the database
RegularUserSchema.methods.comparePassword = async function (password) {
    return bcrypt.compare(password, this.password);
};

export default User;

