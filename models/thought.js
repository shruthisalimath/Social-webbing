const { Schema, model, Types } = require('mongoose');


//create Reaction subdocument schema
const reactionSchema = new Schema (
    {   
        //set custom Id to avoid confusion with parent thought _id
        reactionId: {
            type: Schema.Types.ObjectId,
            default: () =>new Types.ObjectId()
        },
        reactionBody: {
            type: String,
            required: [true, 'Reaction body is required'],
            minlength: 1,
            maxlength: 280
        },
        username: {
            type: String,
            required: [true, 'Username is required'],
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => new Date(timestamp).toLocaleString(),
        }
    },
    {
        toJSON: {
            getters: true
        },
        id: false
    }
);

//schema to create Thought model
const thoughtSchema = new Schema(
    {
        thoughtText: {
            type: String,
            required: [true, 'thoughtText is required'],
            minlength: 1,
            maxlength: 280
        },
        createdAt: {
            type: Date,
            default: Date.now,
            get: (timestamp) => new Date(timestamp).toLocaleString(),
        },
        username: {
            type: String,
            required: true
        },
        reactions: [reactionSchema]
    },
    {
        toJSON: {
            virtuals: true,
            getters: true
        },
        id: false
    }
);
// get total count of friends
thoughtSchema.virtual('reactionCount').get(function () {
    return this.reactions.length;
});

// create the Thought model using the ThoughtSchema
const Thought = model('Thought', thoughtSchema);

// export the Thought model
module.exports = Thought;