const mongoose = require ( 'mongoose' );

const entry_scheme = mongoose.Schema (
    {
        title: {
            type: String,
            required : [ true, "A value for the title is required" ]
        },
        text: { 
            type: String, 
            required: [ true, 'A value for the text is required' ] 
        },
        user: { 
            type: mongoose.Schema.Types.ObjectId, 
            required: true, 
            ref: 'User' 
        }
    },
    { timestamp: true }
);

module.exports = mongoose.model ( "Entry", entry_scheme );
