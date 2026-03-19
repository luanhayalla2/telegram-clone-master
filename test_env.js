const dotenv = require('dotenv');
const result = dotenv.config();
if (result.error) {
  console.error('Error loading .env:', result.error);
} else {
  console.log('Successfully loaded .env');
  console.log('Keys:', Object.keys(result.parsed));
}
