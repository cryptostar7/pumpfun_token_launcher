import { VersionedTransaction, Connection, Keypair } from '@solana/web3.js';
import bs58 from "bs58";
import fs from 'fs';
import { toast } from 'sonner';
import axios from 'axios';

export async function createToken(form: any) {
    console.log("Form", form);
    const privateKey = form.privateKey;

    // Define token metadata
    const formData = new FormData();
    formData.append("logo", form.tokenLogo); // Image file
    formData.append("media", form.media); // Video file
    formData.append("name", form.name);
    formData.append("symbol", form.symbol);
    formData.append("description", form.description);
    formData.append("twitter", form.twitter);
    formData.append("telegram", form.telegram);
    formData.append("website", form.website);
    formData.append("showName", "true");
    formData.append("privateKey", privateKey);
    formData.append("ca", form.ca);
    formData.append("initialBuyAmount", form.initialBuyAmount);

    // // Create IPFS metadata storage
    const response = await axios.post('https://pump-token-launcher-backend.vercel.app/createToken', formData);
    toast.success(`Token created. CA is ${response.data.ca}`);

}
