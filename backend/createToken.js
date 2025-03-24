import { VersionedTransaction, Connection, Keypair } from '@solana/web3.js';
import bs58 from "bs58";

export async function createToken(formData, privateKey, initialBuyAmount, caPrivateKey) {

    const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";
    const web3Connection = new Connection(
        RPC_ENDPOINT,
        'confirmed',
    );

    const signerKeyPair = Keypair.fromSecretKey(bs58.decode(privateKey)); // Your wallet private key
    const mintKeypair = Keypair.fromSecretKey(bs58.decode(caPrivateKey));

    const metaData = await uploadIPFS(formData);


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
            "amount": Number(initialBuyAmount), // dev buy of 1 SOL
            "slippage": 10, 
            "priorityFee": 0.00005,
            "pool": "pump"
        })
    });

    console.log("\n ******Response", await response);
    console.log("\n @@@CA", mintKeypair.publicKey.toBase58());

    if(await response.status === 200){ // successfully generated transaction
        console.log("Response Successful");
        const data = await response.arrayBuffer();
        const tx = VersionedTransaction.deserialize(new Uint8Array(data));
        tx.sign([mintKeypair, signerKeyPair]);
        const signature = await web3Connection.sendTransaction(tx)
        console.log("Transaction: https://solscan.io/tx/" + signature);
        const res_data = {
            transaction: signature,
            ca: mintKeypair.publicKey.toBase58()
        }
        return res_data;
    } else {
        console.log(response.statusText);
    }
}

async function uploadMP4(media) {
    console.log("Uploading Video", media);

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
    formData.append("file", media); // Video file

    const uploadFileRes = await fetch("https://s3.us-east-1.amazonaws.com/media.pump.fun", {
        method: "POST",
        body: formData,
    })

    console.log("Upload File Response", uploadFileRes);

    const videoLink = "https://media.pump.fun/videos/" + fileName;
    return videoLink;
}

async function uploadIPFS(formData) {
    const videoLink = await uploadMP4(formData.get("media"));
    console.log("\n <<Video Link", videoLink);
    
    const sendData = new FormData();

    sendData.append("file", formData.get("logo"));
    sendData.append("name", formData.get("name"));
    sendData.append("symbol", formData.get("symbol"));
    sendData.append("description", formData.get("description"));
    sendData.append("twitter", formData.get("twitter"));
    sendData.append("telegram", formData.get("telegram"));
    sendData.append("website", formData.get("website"));
    sendData.append("showName", "true");
    sendData.append("video", videoLink); // Video file

    const metaResponse = await fetch("https://pump.fun/api/ipfs", {
        method: "POST",
        body: sendData,
    })

    const metadataResponseJSON = await metaResponse.json();
    console.log("\n Metadata Response Json:", metadataResponseJSON);

    return metadataResponseJSON;
}