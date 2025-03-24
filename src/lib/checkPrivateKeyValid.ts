import { Keypair } from '@solana/web3.js';
import bs58 from "bs58";

export const checkPrivateKeyValid = (privateKey) => {
    try {

        // const mintKeypair = Keypair.generate();
        // const mintPrivateKey = mintKeypair.secretKey;
        // const mintCA = mintKeypair.publicKey.toBase58();

        // console.log("Mint Private Key", bs58.encode(mintPrivateKey));
        // console.log("Mint CA", mintCA);

        // Create a Keypair from the private key
        const signerKeyPair = Keypair.fromSecretKey(bs58.decode(privateKey)); // Your wallet private key
        
        // If no error is thrown, the key is valid
        return true;
    } catch (error) {
        console.error("Invalid private key:", error);
        return false;
    }
};