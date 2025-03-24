import { VersionedTransaction, Connection, Keypair } from '@solana/web3.js';
import bs58 from "bs58";
import fs from 'fs';
import { toast } from 'sonner';
import axios from 'axios';

export async function generateCA(form: any) {
    console.log("Form", form);
    const RPC_ENDPOINT = import.meta.env.VITE_RPC_URL;
    const web3Connection = new Connection(
        RPC_ENDPOINT,
        'confirmed',
    );

    const privateKey = form.privateKey;

    // Define token metadata
    const formData = new FormData();
    formData.append("file", form.media); // Image file
    formData.append("name", form.name);
    formData.append("symbol", form.symbol);
    formData.append("description", form.description);
    formData.append("twitter", form.twitter);
    formData.append("telegram", form.telegram);
    formData.append("website", form.website);
    formData.append("showName", "true");
    formData.append("privateKey", privateKey);
    formData.append("initialBuyAmount", form.initialBuyAmount);

    // // Create IPFS metadata storage
    // const metadataResponse = await axios.post('http://localhost:3000/createToken', formData);
    // console.log("Metadata Response Json", metadataResponse);

}