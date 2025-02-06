const fs = require('fs');

const Tour = require('./../../models/tourModel');

require('dotenv').config();
const mongoose = require('mongoose');

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/tours-simple.json`, 'utf-8')
);

const importData = async () => {
  try {
    await Tour.create(tours);

    console.log('Data successfully loaded!');

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

const deleteData = async () => {
  try {
    await Tour.deleteMany();

    console.log('Data successfully deleted!');
  } catch (err) {
    console.log(err);
    process.exit(1);
  }
};

(async () => {
  await deleteData();

  await importData();
})();
