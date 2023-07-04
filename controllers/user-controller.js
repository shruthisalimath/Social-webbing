const { User, Thought } = require('../models');

//User controller
module.exports = {
    //get all users
    async getAllUser(req, res) {
        try {
            const userData = await User.find()
            .select('-__v')
            res.json(userData);
        } catch (err) {
            //console.log(err);
            return res.status(500).json(err);
        }
    },

    //get single user by _id
    async getUserById(req, res) {
        try {
            const userData = await User.findOne({ _id: req.params.userId })
                .select('-__v')
                .populate('friends')
                .populate('thoughts')
            if (!userData) {
                return res.status(404).json({ message: 'No user with that ID!' });
            }
            res.json(userData);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    // Create a User
    async createUser(req, res) {
        try {
            const userData = await User.create(req.body);
            res.json(userData);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    // Update a User by Id
    async updateUser(req, res) {
        try {
            const userData = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true }
            );
            if (!userData) {
                return res.status(404).json({ message: 'No user with that ID!' });
            }
            res.json(userData);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Delete a User by Id
    async deleteUser(req, res) {
        try {
            const userData = await User.findOneAndDelete({ _id: req.params.userId });
            if (!userData) {
                return res.status(404).json({ message: 'No user with that ID!' });
            }
            //delete any thought that has the ID that comes from userData= user that we foundOne and deleted
            await Thought.deleteMany({ _id: { $in: userData.thoughts } })
            //console.log(userData);
            res.json({ message: 'User and assosiated thoughts have been deleted successfully!' });
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Add a friend to user's friend list
    async addFriend(req, res) {
        try {
            const userData = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendsId } },
                { runValidators: true, new: true }
            );
            if (!userData) {
                return res.status(404).json({ message: 'No user with that ID!' });
            }
            res.json(userData);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Remove a friend to user's friend list
    async deleteFriend(req, res) {
        try {
            const userData = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendsId } },
                { runValidators: true, new: true }
            );
            if (!userData) {
                return res.status(404).json({ message: 'No user with that ID!' });
            }
            res.json(userData);
        } catch (err) {
            res.status(500).json(err);
        }
    },
}