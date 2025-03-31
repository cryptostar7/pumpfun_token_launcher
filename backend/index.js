import express from "express";
import cors from "cors";
import multer from "multer";
import fs from 'fs';
import bodyParser from "body-parser";
import path from 'path'; // Import the 'path' module
import { createToken } from "./createToken.js";

const app = express();
const port = 3000;

// const corsOptions = {
//   origin: '*', // Allow all origins
//   methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
//   allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
// };

// app.use(cors(corsOptions));
const corsOptions = {
  origin: '*', // Allow requests from any origin
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}
app.use(cors(corsOptions));

// app.options('*', (req, res) => {
//   res.header('Access-Control-Allow-Origin', '*');
//   res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
//   res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
//   res.sendStatus(204); // No Content
// });


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const storage = multer.memoryStorage(); // Store files in memory  
const upload = multer({ storage }); 

app.get('/test', (req, res) => {
  res.send('Hello World, Test!');
});

app.post('/createToken', upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'media', maxCount: 1 }]), async (req, res) => {
  try {
    const formBody = req.body;
    const files = req.files;
    const formData = new FormData();

    const logoFile = files['logo'] ? files['logo'][0] : null;
    const mediaFile = files['media'] ? files['media'][0] : null;

    if (logoFile) {
      const logoBlob = new Blob([logoFile.buffer], { type: logoFile.mimetype });
      formData.append('logo', logoBlob, logoFile.originalname);
    }
   
    if (mediaFile) {
      const mediaBlob = new Blob([mediaFile.buffer], { type: mediaFile.mimetype });
      formData.append('media', mediaBlob, mediaFile.originalname);
    }

    formData.append('name', formBody.name);
    formData.append('symbol', formBody.symbol);
    formData.append('description', formBody.description);
    formData.append('twitter', formBody.twitter);
    formData.append('telegram', formBody.telegram);
    formData.append('website', formBody.website);
    formData.append('showName', formBody.showName);

    const response = await createToken(formData, formBody.privateKey, formBody.initialBuyAmount, formBody.ca);

    res.status(200).send(response);
  } catch (error) {
    res.status(400).send(error);
  }
})
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
