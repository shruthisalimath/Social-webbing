const router = require('express').Router();
//Import all of the APi routes rom api/index.js
const apiRoutes = require('./api');
//add prefix of '/api' to all the api rputes imported from the 'api' directory
router.use('/api', apiRoutes);

router.use((req, res) => res.send('Wrong route!'));

module.exports = router;
