const express = require('express');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const axios = require('axios');
const path = require('path');

dotenv.config();
const app = express();
app.use(bodyParser.json());
app.use(express.static('public'));

const PORT = process.env.PORT || 3000;
const API_KEY = process.env.FAST2SMS_API_KEY;
const ADMIN_PHONE = process.env.ADMIN_PHONE;

app.post('/book', async (req, res) => {
  const { slot, purpose } = req.body;

  const message = `New Booking:\nSlot: ${slot}\nPurpose: ${purpose}`;

  try {
    await axios.post('https://www.fast2sms.com/dev/bulkV2', {
      route: 'q',
      message,
      language: 'english',
      flash: 0,
      numbers: ADMIN_PHONE
    }, {
      headers: {
        'authorization': API_KEY
      }
    });

    res.status(200).json({ message: 'SMS sent' });
  } catch (error) {
    console.error('SMS sending failed:', error.response?.data || error.message);
    res.status(500).json({ error: 'SMS failed' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
