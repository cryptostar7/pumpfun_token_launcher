import express from "express";
import cors from "cors";
import multer from "multer";
import fs from 'fs';
import bodyParser from "body-parser";
import { createToken } from "./createToken.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const storage = multer.memoryStorage(); // Store files in memory  
const upload = multer({ storage }); 

app.get('/test', (req, res) => {
  res.send('Hello World!');
});


app.post('/createToken', upload.single('file'), (req, res) => {
    const formBody = req.body;
    const formData = new FormData();
    console.log("File", req.file);

    const blob = new Blob([req.file.buffer], {type: req.file.mimetype});

    formData.append('file', blob, req.file.originalname);
    formData.append('name', formBody.name);
    formData.append('symbol', formBody.symbol);
    formData.append('description', formBody.description);
    formData.append('twitter', formBody.twitter);
    formData.append('telegram', formBody.telegram);
    formData.append('website', formBody.website);
    formData.append('showName', formBody.showName);

    createToken(formData, formBody.privateKey, formBody.initialBuyAmount);
    res.send('Successfull Accepted');
})


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});