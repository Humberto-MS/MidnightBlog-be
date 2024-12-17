const jwt = require ( 'jsonwebtoken' );
const asyncHandler = require ( 'express-async-handler' );
const User = require ( '../models/UserModel' );

const protect = asyncHandler ( async ( req, res, next ) => {
    let token;

    if ( req.headers.authorization && req.headers.authorization.startsWith( '' ) ) {
        try {
            token = req.headers.authorization.split( ' ' )[1];
            const decoded = jwt.verify( token, process.env.JWT );
            req.user = await User.findById( decoded.id ).select( 'password' );
            next();
        } catch ( error ) {
            console.log( error );
            res.status( 401 );
            throw new Error( 'Unfortunately, you are not authorized.' );
        }
    }

    if ( ! token ) {
        res.status( 401 );             
        throw new Error( 'Unfortunately, you are not authorized because the token does not exist.' );
    }

} );

module.exports = { protect };
