const { User, Thought } = require('../models');

//User controller
module.exports = {
    //get all users
    async getAllUser(req, res) {
        try {
            const users = await User.find();
            res.json(users);
        } catch (err) {
            //console.log(err);
            return res.status(500).json(err);
        }
    },

    //get single user by _id
    async getUserById(req, res) {
        try {
            const user = await User.findOne({ _id: req.params.userId })
                .select('-__v');
            if(!user) {
                return res.status(404).json({ message: 'No user with that ID!' });
            }
            res.json(user);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    // Create a User
    async createUser(req, res) {
        try {
            const dbUserData = await User.create(req.body);
            res.json(dbUserData);
        } catch (err) {
            console.log(err);
            res.status(500).json(err);
        }
    },

    // Update a User by Id
    async updateUser(req, res) {
        try {
            const dbUserData = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $set: req.body },
                { runValidators: true, new: true}
            );
            if(!dbUserData) {
                return res.status(404).json({ message: 'No user with that ID!' });
            }
            res.json(dbUserData);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Delete a User by Id
    async deleteUser(req, res) {
        try {
            const dbUserData = await User.findOneAndDelete({ _id: req.params.userId });
            if(!dbUserData) {
                return res.status(404).json({ message: 'No user with that ID!' });
            }
            console.log(dbUserData);
            res.json(dbUserData);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Add a friend to user's friend list
    async addFriend(req, res) {
        try {
            const dbUserData = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $addToSet: { friends: req.params.friendsId } },
                { runValidators: true, new: true}
            );
            if(!dbUserData) {
                return res.status(404).json({ message: 'No user with that ID!' });
            }
            //add userId to friendsId's friend list
            await User.findOneAndUpdate(
                { _id: req.params.friendId},
                { $addToSet: { friends: req.params.userId } },
                { runValidators: true, new: true}
            );
            res.json(dbUserData);
        } catch (err) {
            res.status(500).json(err);
        }
    },

    // Remove a friend to user's friend list
    async deleteFriend(req, res) {
        try {
            const dbUserData = await User.findOneAndUpdate(
                { _id: req.params.userId },
                { $pull: { friends: req.params.friendsId } },
                { runValidators: true, new: true}
            );
            if(!dbUserData) {
                return res.status(404).json({ message: 'No user with that ID!' });
            }
            //remove userId from friendsId's friend list
            await User.findOneAndUpdate(
                { _id: req.params.friendId},
                { $pull: { friends: req.params.userId } },
                { runValidators: true, new: true}
            );
            res.json(dbUserData);
        } catch (err) {
            res.status(500).json(err);
        }
    },
}