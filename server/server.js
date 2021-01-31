import express from './config/express.js';

// Use env port or default
const port = process.env.PORT || 5000;

const app = express();
app.listen(port, () => console.log(`Server now running on port ${port}!`));
