const express = require('express');
const session = require('express-session');
require('dotenv').config();

const app = express();

//conversation
//app.use(session({secret: 'anything-you-want-but-keep-secret'}));

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const from = process.env.FROM;
const to = process.env.TO;



app.use('/list-all', async (req, res) => {
    let messages = await client.messages.list({limit: 20});
    res.send(messages);
});

app.use('/list', async (req, res) => {
    let messages = await client.messages
          .list({
             status:"delivered",
             limit: 20
           });
           
           res.send(messages);
});

// /message?messageId=MM800f449d0399ed014aae2bcc0cc2f2ec
app.use('/message', async (req, res) => {
    let messageId = req.query.messageId;
    let messages = await client.messages(messageId).fetch();
    res.send(messages);
});

// /redact?messageId=MM800f449d0399ed014aae2bcc0cc2f2ec
app.use('/redact', async (req, res) => {
    let messageId = req.query.messageId;
    let messages = await client.messages(messageId)
    .update({ body: '' });
    res.send(messages);
});

// /delete?messageId=MM800f449d0399ed014aae2bcc0cc2f2ec
app.use('/delete', async (req, res) => {
    let messageId = req.query.messageId;
    let messages = await client.messages(messageId).remove();
    res.send(messages);
});

//conversation
// app.post('/sms', async (req, res) => {
//     const smsCount = req.session.counter || 0;
  
//     let message = 'Hello, thanks for the new message.';
  
//     if(smsCount > 0) {
//       message = 'Hello, thanks for message number ' + (smsCount + 1);
//     }
  
//     req.session.counter = smsCount + 1;
  
//     const twiml = new MessagingResponse();
//     twiml.message(message);
  
//     res.writeHead(200, {'Content-Type': 'text/xml'});
//     res.end(twiml.toString());
//   });
app.post('/sms', async (req, res) => {
    const twiml = new MessagingResponse();
  
    twiml.message('The Robots are coming! Head for the hills!');
  
    res.writeHead(200, {'Content-Type': 'text/xml'});
    res.end(twiml.toString());
  });


app.use('/send', async (req, res) => {
    try{
        await client.messages.create({
            to,
            from,
            body: "Test msg from Rajd",
        });

        res.send("sent successfully");
    }
    catch(ex){
        res.send(ex.message);
    }
});
// app.use('/', async (req, res) => {});
// app.use('/', async (req, res) => {});
// app.use('/', async (req, res) => {});
// app.use('/', async (req, res) => {});

app.listen(8080);