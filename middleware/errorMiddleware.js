const errorHandler = ( err, req, res, next ) => {
    const statusCode = res.statusCode ? res.statusCode : 500;
    res.status ( statusCode );
 
    let message = err.message;
    res.json ( { message: message } );
};
 
module.exports = { errorHandler };