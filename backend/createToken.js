import { VersionedTransaction, Connection, Keypair } from '@solana/web3.js';

export async function createToken(formData, privateKey, initialBuyAmount) {

    const RPC_ENDPOINT = "https://api.mainnet-beta.solana.com";
    const web3Connection = new Connection(
        RPC_ENDPOINT,
        'confirmed',
    );

    // const signerKeyPair = Keypair.fromSecretKey(bs58.decode(privateKey)); // Your wallet private key
    // // console.log("Signer Key Pair", signerKeyPair);
    // // Generate a random keypair for token
    const mintKeypair = Keypair.generate(); 

    // Create IPFS metadata storage
    const metadataResponse = await fetch("https://pump.fun/api/ipfs", {
        method: "POST",
        body: formData,
    });
    console.log("\n <<<Metadata Response:", metadataResponse);

    const metadataResponseJSON = await metadataResponse.json();
    console.log("\n Metadata Response Json:", metadataResponseJSON);

    // Get the create transaction
    const response = await fetch(`https://pumpportal.fun/api/trade-local`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "publicKey": 'BuM6MqYbBVZLrTJsEnY9pDWxKc96sTek4eGdwTPGLqUM',
            "action": "create",
            "tokenMetadata": {
                name: metadataResponseJSON.metadata.name,
                symbol: metadataResponseJSON.metadata.symbol,
                uri: metadataResponseJSON.metadataUri
            },
            "mint": mintKeypair.publicKey.toBase58(),
            "denominatedInSol": "true",
            "amount": initialBuyAmount, // dev buy of 1 SOL
            "slippage": 10, 
            "priorityFee": 0.0005,
            "pool": "pump"
        })
    });

    // if(response.status === 200){ // successfully generated transaction
    //     const data = await response.arrayBuffer();
    //     const tx = VersionedTransaction.deserialize(new Uint8Array(data));
    //     tx.sign([mintKeypair, signerKeyPair]);
    //     const signature = await web3Connection.sendTransaction(tx)
    //     console.log("Transaction: https://solscan.io/tx/" + signature);
    // } else {
    //     console.log(response.statusText); // log error
    // }

    console.log("\n Creation Response:", response);
}