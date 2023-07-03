//define the methods fro CRUD operations on thoughts and reactions

const { User, Thought } = require('../models');

//Thought controller
module.exports = {
    //get all Thoughts
    async getAllThought(req, res) {
        try {
            const thoughtData = await Thought.find()
                .select('-__v');
            res.json(thoughtData);
        } catch (err) {
            //console.log(err);
            return res.status(500).json(err);
        }
    },

    //get single thought by _id
    async getThoughtById(req, res) {
        try {
            const thoughtData = await Thought.findOne({ _id: req.params.thoughtId })
                .select('-__v');
            if (!thoughtData) {
                return res.status(404).json({ message: 'No Thought found by that ID!' });
            }
            res.json(thoughtData);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    // Create a Thought
    async createThought(req, res) {
        try {
            const thoughtData = await Thought.create(req.body);
            const userData = await User.findOneAndUpdate(
                { _id: req.body.userId },
                { $push: { thoughts: thoughtData._id } },
                { runValidators: true, new: true }
            );
            res.json(thoughtData);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    //update thought by id
    async updateThought(req, res) {
        try {
            const thoughtData = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            if (!thoughtData) {
                return res.status(404).json({ message: 'No Thought found with that ID!' });
            }
            res.json(thoughtData);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Delete a User by Id
    async deleteThought(req, res) {
        try {
            const thoughtData = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
            if (!thoughtData) {
                return res.status(404).json({ message: 'No thought found with that ID!' });
            }
            res.json({ message: 'The thought has been Deleted successfully!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //add Reaction to Tought
    async addReaction(req, res) {
        try {
            const thoughtData = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $push: { reactions: req.body } },
                { runValidators: true, new: true }
            );
            if (!thoughtData) {
                return res.status(404).json({ message: 'No Thought found with that ID!' });
            }
            res.json(thoughtData);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Remove reaction from thought
    async deleteReaction(req, res) {
        try {
            const thoughtData = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            );
            if (!thoughtData) {
                return res.status(404).json({ message: 'No Thought found with that ID!' });
            }
            res.json(thoughtData);
        } catch (err) {
            res.status(500).json(err);
        }
    },
}