require('dotenv').config()
const axios = require('axios').default;
const express = require('express');
const bodyParser = require('body-parser');
const moment = require('moment');
const app = express();
const port = process.env.PORT;
const botUrl = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

async function sendRequest(message) {
  await new Promise(resolve => setTimeout(resolve, 15000));
  await axios.post(`${process.env.DEPLOY_URL}new-message`, {
    message
  });
}

app.post('/new-message', (req, res) => {
  const { message } = req.body;
  console.log(`Request received - message: ${message.text}`)
  
  if (!message) res.end()
  
  const local = moment(Date.now()).subtract(3, 'h');
  axios.post(`${botUrl}/sendMessage`, {
    chat_id: message.chat.id,
    text: `Olha a hora - ${local.format('h:mm:ss')}`
    })
    .then(response => {
      console.log('message sent');
      sendRequest(message);
      res.end('ok');
    })
    .catch(err => {
      console.log('error');
      res.end('ok');
    });
});
  
  app.listen(port, () => {
    console.log(`Listening on ${port}`);
  });
  