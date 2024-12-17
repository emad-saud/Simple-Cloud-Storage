const mongoose = require('mongoose');

const dotenv = require('dotenv');
dotenv.config({ path: `${__dirname}/config.env` });

const app = require('./app');

mongoose
  .connect(process.env.DATABASE_LOCAL)
  .then(() => {
    console.log('DB connection successful!');
  })
  .catch((err) => {
    console.log('failed to connect to the database! exiting the program...');
    process.exit(1);
  });

const port = process.env.PORT || 3000;

const server = app.listen(port, () => {
  console.log(`App is running on port ${port}...`);
});

process.on('unhandledRejection', (err, pr) => {
  console.log('UNHANDLED REJECTION 💥 Shutting down...');
  console.log(err.name, err.message);
  console.log(err.stack);
  server.close(() => {
    process.exit(1);
  });
});
