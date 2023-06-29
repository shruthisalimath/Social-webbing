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

// set up GET one,PUT and DELETE at api/thoughts/: id
router.route('/:id').get(getThoughtById).put(updateThought).delete(deleteThought);

//api/thoughts/:thoughtId/reactions/reactionId
router.route('/:thoughtId/reactions/:reactionId').delete(removeReaction);

module.exports = router;