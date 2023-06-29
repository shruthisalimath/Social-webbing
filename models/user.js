const { Schema, model } = require('mongoose');

//schema to create user model
const userSchema = new Schema(
    {
        username: {
            type: String,
            required: [true, 'username is mandatory'],
            unique: true,
            trim: true
        },

        email: {
            type: String,
            required: [true, 'email is mandatory'],
            unique: true,
            match: [/.+@.+\..+/, 'Please enter a valid email address']
        },

        thoughts: [
            {
                type: Schema.Types.ObjectId,
                ref: 'Thought'
            }
        ],

        friends: [
            {
                type: Schema.Types.ObjectId,
                ref: 'User'
            }
        ]
    },
    {
        toJSON: {
            virtuals: true
        },
        id: false
    }
);
// get total count of friends
userSchema.virtual('friendCount').get(function () {
    return this.friends.length;
});

// create the User model using the UserSchema
const User = model('User', userSchema);

// export the User model
module.exports = User;