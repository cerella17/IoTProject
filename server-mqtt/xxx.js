const solanaWeb3 = require("@solana/web3.js");

async function main() {
  // Connettiti a devnet (o all'ambiente di tuo interesse)
  const connection = new solanaWeb3.Connection(
    solanaWeb3.clusterApiUrl("devnet")
  );
  const programId = new solanaWeb3.PublicKey(
    "2mfaAWB2W9BXFS2DvyEZNK1UaVBNmwASFrEaDnB6GpeX"
  );

  // Ottieni tutti gli account associati al programma
  const accounts = await connection.getProgramAccounts(programId);

  console.log(`Trovati ${accounts.length} account associati al programma.`);
  accounts.forEach((acc, i) => {
    console.log(`\nAccount ${i + 1}:`);
    console.log(`Pubblica chiave: ${acc.pubkey.toBase58()}`);
    console.log(`Dati (in base64): ${acc.account.data.toString("base64")}`);
  });
}

main()
  .then(() => console.log("Query completata"))
  .catch((err) => {
    console.error(err);
  });
