const asyncHandler = require ( 'express-async-handler' );
const Entry = require ( '../models/EntryModel' );
const User = require ( '../models/UserModel' );

const getEntries = asyncHandler ( async ( req, res ) => {
    const entries = await Entry.find ( { user: req.user.id } );
    res.status ( 200 ).json ( entries );
} );

const createEntry = asyncHandler ( async ( req, res ) => {
    const { title, text } = req.body; 
    
    if ( !title || !text ) { 
        res.status ( 400 ); 
        throw new Error ( 'Both title and text fields are required' ); 
    } 
    
    const entry = await Entry.create ( { title, text, user: req.user.id } );
    res.status ( 200 ).json ( entry );
} );

const updateEntry = asyncHandler ( async ( req, res ) => {
    const entry = await Entry.findById ( req.params.id );

    if ( !entry ) {
        res.status ( 404 )
        throw new Error ( "Entry not found" )
    }

    const user = await User.findById ( req.user.id );

    if ( !user ) {
        res.status ( 404 );
        throw new Error ( "User not found" );
    }

    if ( entry.user.toString() !== user.id ) {
        res.status ( 401 );
        throw new Error ( "Usuario no autorizado para actualizar" );
    }

    const updated_entry = await Entry.findByIdAndUpdate ( 
        req.params.id, 
        req.body,
        { new: true }
    );

    res.status ( 200 ).json ( updated_entry );
} );

const deleteEntry = asyncHandler ( async ( req, res ) => {
    const entry = await Entry.findById ( req.params.id );

    if ( !entry ) {
        res.status ( 404 );
        throw new Error ( 'Entry not found' );
    }

    const user = await User.findById ( req.user.id );

    if ( !user ) {
        res.status ( 404 );
        throw new Error ( "User not found" );
    }

    if ( entry.user.toString() !== user.id ) {
        res.status ( 401 );
        throw new Error ( "User not authorized to delete" );
    }

    await Entry.findByIdAndDelete ( req.params.id );
    res.status ( 200 ).json ( { id: req.params.id } );
} );

module.exports = { getEntries, createEntry, updateEntry, deleteEntry };
