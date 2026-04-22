import {
  Connection,
  Keypair,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";

const keypair = Keypair.generate();
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

console.log("Public key:", keypair.publicKey.toBase58());
console.log("\nRequesting devnet airdrop...");

try {
  const sig = await connection.requestAirdrop(
    keypair.publicKey,
    2 * LAMPORTS_PER_SOL,
  );
  await connection.confirmTransaction(sig);
  const balance = await connection.getBalance(keypair.publicKey);
  console.log("Balance:", balance / LAMPORTS_PER_SOL, "SOL");
} catch {
  console.log("Airdrop failed (rate limited). Fund manually:");
  console.log(`  solana airdrop 2 ${keypair.publicKey.toBase58()} --url devnet`);
}

const secretArray = `[${Array.from(keypair.secretKey).join(",")}]`;
console.log("\nSet this Convex env var:");
console.log(`  pnpm convex env set SOLANA_KEYPAIR '${secretArray}'`);
console.log(`  pnpm convex env set SOLANA_RPC_URL 'https://api.devnet.solana.com'`);
