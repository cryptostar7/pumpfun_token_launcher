import { VersionedTransaction, Connection, Keypair } from '@solana/web3.js';
import bs58 from "bs58";

export async function createToken(formData, privateKey, initialBuyAmount) {

    const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";
    const web3Connection = new Connection(
        RPC_ENDPOINT,
        'confirmed',
    );

    const signerKeyPair = Keypair.fromSecretKey(bs58.decode(process.env.PRIVATE_KEY)); // Your wallet private key
    const mintKeypair = Keypair.generate(); 

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
            "amount": initialBuyAmount, // dev buy of 1 SOL
            "slippage": 10, 
            "priorityFee": 0.00005,
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
}

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

    const videoLink = "https://media.pump.fun/videos/" + fileName;
    return videoLink;
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