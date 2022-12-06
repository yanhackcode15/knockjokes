import dotenv from 'dotenv' 
dotenv.config()
import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

import bodyParser from 'body-parser';
import {getJoke, addJoke} from './config.js';
import Twilio from 'twilio';
const VoiceResponse = Twilio.twiml.VoiceResponse;

const app = express();
const port = process.env.PORT || 8000;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());


var joke = {}
app.get('/joke', (req, res)=>{
  res.sendFile(path.join(__dirname, '/index.html'));
})
app.post('/addJoke', async (req, res)=>{
  await addJoke(req.body.subject, req.body.punchline);
  console.log(req.body);
  res.type('text/plain');
  res.send('received the post')
})
app.post('/start', async (req, res) => {
    const result = await getJoke();
    joke.id = result.id;
    joke.subject = result.subject.toLowerCase();
    joke.punchline = result.punchline.toLowerCase();
    const twiml = new VoiceResponse();
    twiml.say('Knock knock!');
  
    twiml.gather({
      speechTimeout: 'auto',
      input: 'speech',
      speechModel: 'phone_call',
      language: 'en-US',
      hints: "who's there",
      action: '/whosthere'
    });
    twiml.gather({
      speechTimeout: 'auto',
      input: 'speech',
      speechModel: 'phone_call',
      language: 'en-US',
      hints: "who's there",
      action: '/whosthere'
    }).say('Try again and speak faster this time.');
    twiml.say("Sorry we timed out. Try calling back again.")
    res.type('text/xml');
    res.send(twiml.toString());

});

app.all('/whosthere', (req, res)=>{
  const userInput = req.body.SpeechResult.toLowerCase();
  
  const twiml = new VoiceResponse();
  if(userInput.includes("there")){
    twiml.say(joke.subject);
    twiml.gather({
      speechTimeout: 'auto',
      input: 'speech',
      speechModel: 'phone_call',
      language: 'en-US',
      hints: "who",
      action: '/punchline'
    });
    twiml.gather({
      speechTimeout: 'auto',
      input: 'speech',
      speechModel: 'phone_call',
      language: 'en-US',
      hints: "who",
      action: '/punchline'
    }).say('trying again. The last line is '+joke.subject);
    twiml.say("Sorry we timed out. Try calling back again.")
      
    res.type('text/xml');
    res.send(twiml.toString());
  }
})

app.all('/punchline', (req, res)=>{
  const userInput = req.body.SpeechResult.toLowerCase();
  // console.log('userinput', userInput);
  // const confidence = req.body.Confidence;
  const twiml = new VoiceResponse();
  if(userInput.includes('')){
    twiml.say(joke.punchline); 
    twiml.gather({
      speechTimeout: 'auto',
      input: 'speech',
      speechModel: 'phone_call',
      language: 'en-US',
      hints: "another joke, start",
      action: '/start'
    }).say('Hang out or say start to get another joke');}
    else {
    twiml.say("Sorry we timed out. Try calling back again.")
    }  
    res.type('text/xml');
    res.send(twiml.toString());
  
})

app.use('/', express.static(__dirname + '/'));


app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(err);
})

app.listen(port, ()=>console.log("Twilio Client app HTTP server running at localhost port", port));
  
  



