import { Keypair } from '@solana/web3.js';
import bs58 from "bs58";

export const checkPrivateKeyValid = (privateKey) => {
    try {
        const grindKeyPair = Keypair.fromSecretKey(bs58.decode(privateKey)); // Your wallet private key
        const grindCA = grindKeyPair.publicKey.toBase58();
        
        // If no error is thrown, the key is valid
        return grindCA;
    } catch (error) {
        console.error("Invalid private key:", error);
        return false;
    }
};