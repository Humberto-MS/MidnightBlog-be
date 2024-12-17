const asyncHandler = require ( 'express-async-handler' );
const jwt = require ( 'jsonwebtoken' );
const bcrypt = require ( 'bcryptjs' );
const User = require ( '../models/UserModel' );

const register = asyncHandler ( async ( req, res ) => {
    const { name, email, password } = req.body;

    if ( !name || !email || !password ) {
        res.status ( 400 );
        throw new Error ( 'Every field is required' );
    }

    const user_exists = await User.findOne ( { email } );

    if ( user_exists ) {
        res.status ( 400 );
        throw new Error ( 'A user with that email already exists' );
    }

    const salt = await bcrypt.genSalt ( 10 );
    const encrypted_password = await bcrypt.hash ( password, salt );
    const user = await User.create ( { name, email, password: encrypted_password } );

    if ( user ) {
        res.status ( 201 ).json ( { 
            _id: user.id, 
            name: user.name, 
            email: user.email, 
            token: generateJWT ( user.id ) 
        } );
    } else {
        res.status ( 400 );
        throw new Error ( 'Invalid user data' );
    }
} );

const login = asyncHandler ( async ( req, res ) => {
    const { email, password } = req.body;
    const user = await User.findOne ( { email } );

    if ( user && ( await bcrypt.compare ( password, user.password ) ) ) {
	    res.json ( { 
            _id: user.id, 
            name: user.name, 
            email: user.email, 
            token: generateJWT ( user._id ) 
        } );
    } else {
	    res.status ( 400 );
	    throw new Error ( 'Invalid login data' );
    }
} );

const getCurrentUser = asyncHandler ( async ( req, res ) => {
    const { _id, name, email } = await User.findById ( req.user.id );
    res.status ( 200 ).json ( { _id, name, email } );
} );

const generateJWT = id => jwt.sign ( { id }, process.env.JWT, { expiresIn: '5d' } );

module.exports = { register, login, getCurrentUser };
