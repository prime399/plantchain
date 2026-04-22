"use node";

import {
  Connection,
  Keypair,
  Transaction,
  TransactionInstruction,
  PublicKey,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { v } from "convex/values";

import { internal } from "./_generated/api";
import { internalAction } from "./_generated/server";

const MEMO_PROGRAM_ID = new PublicKey(
  "MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr",
);

export const recordOnChain = internalAction({
  args: { plantingId: v.id("plantings") },
  handler: async (ctx, { plantingId }) => {
    const rpcUrl = process.env.SOLANA_RPC_URL;
    const keypairJson = process.env.SOLANA_KEYPAIR;

    if (!rpcUrl || !keypairJson) {
      console.log("Solana env vars not set, skipping on-chain recording");
      return;
    }

    const planting = await ctx.runQuery(
      internal.plantings.getInternal,
      { plantingId },
    );
    if (!planting || planting.status !== "verified") return;

    const secretKey = new Uint8Array(JSON.parse(keypairJson) as number[]);
    const payer = Keypair.fromSecretKey(secretKey);
    const connection = new Connection(rpcUrl, "confirmed");

    const memo = JSON.stringify({
      app: "plantchain",
      id: plantingId,
      species: planting.species,
      lat: planting.latitude,
      lng: planting.longitude,
      verifiedAt: planting.verificationResult?.verifiedAt,
    });

    const tx = new Transaction().add(
      new TransactionInstruction({
        keys: [{ pubkey: payer.publicKey, isSigner: true, isWritable: true }],
        programId: MEMO_PROGRAM_ID,
        data: Buffer.from(memo, "utf-8"),
      }),
    );

    try {
      const signature = await sendAndConfirmTransaction(connection, tx, [payer]);
      await ctx.runMutation(internal.plantings.storeSolanaTx, {
        plantingId,
        signature,
      });
      console.log(`Recorded on-chain: ${signature}`);
    } catch (err) {
      console.error("Solana transaction failed:", err);
    }
  },
});
