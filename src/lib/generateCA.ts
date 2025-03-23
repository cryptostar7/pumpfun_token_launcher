import { VersionedTransaction, Connection, Keypair } from '@solana/web3.js';
import bs58 from "bs58";
import fs from 'fs';
import { toast } from 'sonner';

export async function generateCA(form: any) {
    console.log("Form", form);
    const RPC_ENDPOINT = import.meta.env.VITE_RPC_URL;
    const web3Connection = new Connection(
        RPC_ENDPOINT,
        'confirmed',
    );

    // const privateKey = form.privateKey;

    // const signerKeyPair = Keypair.fromSecretKey(bs58.decode(privateKey));

    // // Generate a random keypair for token
    // const mintKeypair = Keypair.generate(); 

    // Define token metadata
    const formData = new FormData();
    formData.append("file", form.media), // Image file
    formData.append("name", form.name),
    formData.append("symbol", form.symbol),
    formData.append("description", form.description),
    formData.append("twitter", form.twitter),
    formData.append("telegram", form.telegram),
    formData.append("website", form.website),
    formData.append("showName", "true");

    // Create IPFS metadata storage
    const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
        method: "POST",
        body: formData,
        headers: {
            "Content-Type": "multipart/form-data"
        },
        mode: 'no-cors'
    });
    // console.log("Metadata Response Json", metadataResponse);

    const metadataResponseJSON = await metadataResponse.json();

    // // Get the create transaction
    // const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
    //     method: "POST",
    //     headers: {
    //         "Content-Type": "application/json"
    //     },
    //     body: JSON.stringify({
    //         "publicKey": 'your-wallet-public-key',
    //         "action": "create",
    //         "tokenMetadata": {
    //             name: metadataResponseJSON.metadata.name,
    //             symbol: metadataResponseJSON.metadata.symbol,
    //             uri: metadataResponseJSON.metadataUri
    //         },
    //         "mint": mintKeypair.publicKey.toBase58(),
    //         "denominatedInSol": "true",
    //         "amount": 1, // dev buy of 1 SOL
    //         "slippage": 10, 
    //         "priorityFee": 0.0005,
    //         "pool": "pump"
    //     })
    // });
    // if(response.status === 200){ // successfully generated transaction
    //     const data = await response.arrayBuffer();
    //     const tx = VersionedTransaction.deserialize(new Uint8Array(data));
    //     tx.sign([mintKeypair, signerKeyPair]);
    //     const signature = await web3Connection.sendTransaction(tx)
    //     console.log("Transaction: https://solscan.io/tx/" + signature);
    // } else {
    //     console.log(response.statusText); // log error
    // }
}

// sendLocalCreateTx();