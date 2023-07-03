const { User, Thought } = require('../models');

//Thought controller
module.exports = {
    //get all Thoughts
    async getAllThought(req, res) {
        try {
            const thoughts = await Thought.find()
                .populate({ path: "username" })
                .sort({ _id: -1 });
            res.json(thoughts);
        } catch (err) {
            //console.log(err);
            return res.status(500).json(err);
        }
    },

    //get single thought by _id
    async getThoughtById(req, res) {
        try {
            const thoughts = await Thought.findOne({ _id: req.params.thoughtId });

            if (!thoughts) {
                return res.status(404).json({ message: 'No Thought found by that ID!' });
            }
            res.json(thoughts);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    // Create a Thought
    async createThought(req, res) {
        try {
            const newThought = await Thought.create(req.body)
                .then(({ _id }) => {
                    return User.findOneAndUpdate(
                        { _id: req.body.userId },
                        { $push: { thoughts: _id } },
                        { runValidators: true, new: true }
                    );
                })
                .then((thoughtData) => {
                    //console.log(thoughtData._id);
                    if (!thoughtData) {
                        res.status(404).json({ message: 'No User found with that ID!' });
                    }
                    res.json(thoughtData);
                });

        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    //update thought by id
    async updateThought(req, res) {
        try {
            const dbThoughtData = await Thought.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No Thought found with that ID!' });
            }
            res.json(dbThoughtData);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Delete a User by Id
    async deleteThought(req, res) {
        try {
            const dbThoughtData = await Thought.findOneAndDelete({ _id: req.params.thoughtId });
            if (!dbThoughtData) {
                return res.status(404).json({ message: 'No thought found with that ID!' });
            }
            //delete thought reference from user
            await User.findOneAndUpdate(
                { username: dbThoughtData.username },
                { $pull: { thoughts: req.params.thoughtId } }
            );
            console.log(dbThoughtData);
            res.json(dbThoughtData);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    //add Reaction to Tought
    async addReaction(req, res) {
        try {
            const dbThoughtData = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $push: { reactions: req.body } },
                { runValidators: true, new: true }
            )
                .populate({
                    path: 'reactions',
                    select: '-__v',
                })
                .select('-__v')
                .then((userData))
            if (!userData) {
                return res.status(404).json({ message: 'No Thought found with that ID!' });
            }
            res.json(userData);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Remove reaction from thought
    async deleteReaction(req, res) {
        try {
            const dbThoughtData = await Thought.findOneAndUpdate(
                { _id: req.params.thoughtId },
                { $pull: { reactions: { reactionId: req.params.reactionId } } },
                { runValidators: true, new: true }
            )
                .populate({
                    path: 'reactions',
                    select: '-__v',
                })
                .select('-__v')
                .then((userData))
            if (!userData) {
                return res.status(404).json({ message: 'No Thought found with that ID!' });
            }
            res.json(userData);
        } catch (err) {
            res.status(500).json(err);
        }
    },
}