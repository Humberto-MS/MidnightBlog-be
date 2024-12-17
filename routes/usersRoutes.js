const express = require ( 'express' );
const router = express.Router();
const { register, login, getCurrentUser } = require ( '../controllers/usersController' );
const { protect } = require ( '../middleware/authMiddleware' );

router.post( '/', register );
router.post( '/login', login );
router.get( '/current', protect, getCurrentUser );

module.exports = router;