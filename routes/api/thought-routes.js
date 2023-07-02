const router = require('express').Router();

const {
    getAllThought,
    getThoughtById,
    createThought,
    updateThought,
    deleteThought,
    addReaction,
    removeReaction
} = require ('../../controllers/thought-controller');

//set up GET all and post at/api/thoughts
router.route('/').get(getAllThought).post(createThought);

// set up GET one,PUT and DELETE at api/thoughts/: thoughtId
router.route('/:thoughtId').get(getThoughtById).put(updateThought).delete(deleteThought);

//api/thoughts/:thoughtId/reactions
router.route('/:thoughtId/reactions').post(addReaction);

//api/thoughts/:thoughtId/reactions/reactionId
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;