const express = require ( 'express' );
const dotenv = require ( 'dotenv' ).config();
const { errorHandler } = require ( './middleware/errorMiddleware' );
const dbConnection = require ( './connections/dbConnection' );
const port = process.env.PORT || 8000;

dbConnection();
const app = express();

app.use ( express.json() );
app.use ( express.urlencoded ( { extended: false } ) );

app.use ( '/api/entries', require ( './routes/entriesRoutes.js' ) );
app.use ( '/api/users', require ( './routes/usersRoutes.js' ) );

app.use ( errorHandler );

app.listen ( port, () => {
  console.log ( `Server is listening on http://localhost:${port}...` );
});
