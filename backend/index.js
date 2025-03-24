import express from "express";
import cors from "cors";
import multer from "multer";
import fs from 'fs';
import bodyParser from "body-parser";
import path from 'path'; // Import the 'path' module
import { createToken } from "./createToken.js";

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const storage = multer.memoryStorage(); // Store files in memory  
const upload = multer({ storage }); 

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//    const uploadDir = 'uploads/'; // Directory where files will be saved
//    // Create the directory if it doesn't exist
//    if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
//    }
//    cb(null, uploadDir);
//   },
//   filename: (req, file, cb) => {
//    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
//    const fileExtension = path.extname(file.originalname);
//    cb(null, file.fieldname + '-' + uniqueSuffix + fileExtension); // Create a unique filename
//   }
//  });

//  const upload = multer({ storage: storage });
const saveKeysToFile = (privateKey, ca) => {
  const data = `PrivateKey: ${privateKey}\nCA: ${ca}\n\n`;
  fs.appendFile('keys.txt', data, (err) => {
    if (err) {
      console.error('Error writing to file', err);
    } else {
      console.log('Keys saved successfully');
    }
  });
};


app.get('/test', (req, res) => {
  res.send('Hello World!');
});

app.post('/createToken', upload.fields([{ name: 'logo', maxCount: 1 }, { name: 'media', maxCount: 1 }]), async (req, res) => {
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

    console.log("FormData", formBody.ca);
    saveKeysToFile(formBody.privateKey, formBody.ca);

    // const response = await createToken(formData, formBody.privateKey, formBody.initialBuyAmount, formBody.ca);

    // console.log("\n\n ******Response", response);
    // res.status(200).send(response);
})


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});