import { VersionedTransaction, Connection, Keypair } from '@solana/web3.js';
import bs58 from "bs58";
import dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();


const RPC_ENDPOINT = process.env.RPC_URL;
const web3Connection = new Connection(
    RPC_ENDPOINT,
    'confirmed',
);

console.log("RPC_EndPoint",RPC_ENDPOINT);

async function uploadMP4() {
    const signRes = await fetch("https://frontend-api-v3.pump.fun/videos/get-signed-url?extension=mp4", {
        method: "GET"
    });
    const signResJson = await signRes.json();
    console.log("Sign Response", signResJson.url.fields);

    const formData = new FormData();
    const fileName = signResJson.filename;
    for (const key in signResJson.url.fields) {
        if (signResJson.url.fields.hasOwnProperty(key)) {
            formData.append(key, signResJson.url.fields[key]);
        }
    }
    formData.append("file", await fs.openAsBlob("./3.mp4")); // Video file

    const uploadFileRes = await fetch("https://s3.us-east-1.amazonaws.com/media.pump.fun", {
        method: "POST",
        body: formData,
    })

    console.log("Upload File Response", uploadFileRes);

    const return_val = "https://media.pump.fun/videos/" + fileName;
    return return_val;
}

async function uploadIPFS() {
    const videoLink = await uploadMP4();
    console.log("\n <<Video Link", videoLink);

    const formData = new FormData();
    formData.append("file", await fs.openAsBlob("./1.gif")); // Image file
    formData.append("name", "Click My Computer");
    formData.append("symbol", "CMC");
    formData.append("description", "This is fun token by created me and click 'My Computer' ❤✨🎁");
    formData.append("twitter", "https://twitter.com/ClickMyComputer");
    formData.append("telegram", "https://t.me/ClickMyComputer");
    formData.append("website", "https:///ClickMyComputer.com");
    formData.append("showName", "true");
    formData.append("video", videoLink); // Video file

    const metaResponse = await fetch("https://pump.fun/api/ipfs", {
        method: "POST",
        body: formData,
    })
    // console.log("\n <<<Metadata Response:", metaResponse);

    const metadataResponseJSON = await metaResponse.json();
    console.log("\n Metadata Response Json:", metadataResponseJSON);

    return metadataResponseJSON;
}

async function createToken() {
    const signerKeyPair = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY)); // Your wallet private key
    const mintKeypair = Keypair.generate();

    const metaData = await uploadIPFS();
    console.log("\n <<Metadata", metaData);
    
    const formData = new FormData();
    formData.append("metadataUri", metaData.metadataUri);
    formData.append("name", metaData.metadata.name);
    formData.append("ticker", metaData.metadata.symbol);
    formData.append("description", metaData.metadata.description);
    formData.append("twitter", metaData.metadata.twitter);
    formData.append("telegram", metaData.metadata.telegram);
    formData.append("website", metaData.metadata.website);
    formData.append("showName", metaData.metadata.showName);
    formData.append("image", metaData.metadata.image);
    formData.append("video", metaData.metadata.video);


    const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "publicKey": '8qaBTiio6kHG3qziNEARj7pfcKYNzZVi2hDP1dmiMH25',
            "action": "create",
            "tokenMetadata": {
                name: metaData.metadata.name,
                symbol: metaData.metadata.symbol,
                uri: metaData.metadataUri
            },
            "mint": mintKeypair.publicKey.toBase58(),
            "denominatedInSol": "true",
            "amount": 0.00001, // dev buy of 1 SOL
            "slippage": 10, 
            "priorityFee": 0.0005,
            "pool": "pump"
        })
    });

    console.log("\n ******Response", response);
    console.log("\n @@@CA", mintKeypair.publicKey.toBase58());

    if(response.status === 200){ // successfully generated transaction
        console.log("Response Successful");
        const data = await response.arrayBuffer();
        const tx = VersionedTransaction.deserialize(new Uint8Array(data));
        tx.sign([mintKeypair, signerKeyPair]);
        const signature = await web3Connection.sendTransaction(tx)
        console.log("Transaction: https://solscan.io/tx/" + signature);
    } else {
        console.log(response.statusText);
    }

    // console.log("\n <<<Creation Response:", await response.json());

    // const tokenCreationRes = await fetch("https://frontend-api-v3.pump.fun/coins/create", {
    //     methodod: "POST",
    //     body: formData,
    // })

    // console.log("Token Creation Response", tokenCreationRes);
    // const tokenCreationResJson = await tokenCreationRes.json();
    // console.log(tokenCreationResJson);
}

// async function sendLocalCreateTx(){
//     const signerKeyPair = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY)); // Your wallet private key
//     // // console.log("Signer Key Pair", signerKeyPair);
//     // // Generate a random keypair for token
//     const mintKeypair = Keypair.generate(); 

//     // Define token metadata
//     const formData = new FormData();
//     formData.append("file", await fs.openAsBlob("./slack1.png")), // Image file
//     formData.append("name", "QTYDeveloper123123"),
//     formData.append("symbol", "TEST"),
//     formData.append("description", "This is an example token created via PumpPortal.fun"),
//     formData.append("twitter", "https://x.com/a1lon9/status/1812970586420994083"),
//     formData.append("telegram", "https://x.com/a1lon9/status/1812970586420994083"),
//     formData.append("website", "https://pumpportal.fun"),
//     formData.append("showName", "true");
//     formData.append("file", await fs.openAsBlob("./1.mp4")), // Video file

//     console.log("\n Form Data: ", formData.file);
//     // Create IPFS metadata storage
//     const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
//         method: "POST",
//         body: formData,
//     });
//     console.log("\n <<<Metadata Response:", metadataResponse);

//     // const metadataResponseJSON = await metadataResponse.json();
//     // console.log("\n Metadata Response Json:", metadataResponseJSON);

//     // // Get the create transaction
//     // const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
//     //     method: "POST",
//     //     headers: {
//     //         "Content-Type": "application/json"
//     //     },
//     //     body: JSON.stringify({
//     //         "publicKey": 'BuM6MqYbBVZLrTJsEnY9pDWxKc96sTek4eGdwTPGLqUM',
//     //         "action": "create",
//     //         "tokenMetadata": {
//     //             name: metadataResponseJSON.metadata.name,
//     //             symbol: metadataResponseJSON.metadata.symbol,
//     //             uri: metadataResponseJSON.metadataUri
//     //         },
//     //         "mint": mintKeypair.publicKey.toBase58(),
//     //         "denominatedInSol": "true",
//     //         "amount": 0.001, // dev buy of 1 SOL
//     //         "slippage": 10, 
//     //         "priorityFee": 0.0005,
//     //         "pool": "pump"
//     //     })
//     // });

//     // console.log("\n Creation Response:", response);

//     // if(response.status === 200){ // successfully generated transaction
//     //     console.log("Response Successful");
//     //     const data = await response.arrayBuffer();
//     //     const tx = VersionedTransaction.deserialize(new Uint8Array(data));
//     //     tx.sign([mintKeypair, signerKeyPair]);
//     //     const signature = await web3Connection.sendTransaction(tx)
//     //     console.log("Transaction: https://solscan.io/tx/" + signature);
//     // } else {
//     //     console.log(response.statusText); // log error
//     // }
// }

// sendLocalCreateTx();
createToken();