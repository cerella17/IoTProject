const anchor = require("@project-serum/anchor");
const { Connection, PublicKey, SystemProgram } = require("@solana/web3.js");
const fs = require("fs");
const path = require("path");

// Carica l'IDL
const idl = JSON.parse(
  fs.readFileSync(path.join(__dirname, "idl.json"), "utf8")
);

// Inserisci qui il tuo Program ID
const programId = new PublicKey("2mfaAWB2W9BXFS2DvyEZNK1UaVBNmwASFrEaDnB6GpeX");

// Percorso al file delle chiavi del wallet
const walletKeypairPath = path.join(__dirname, "wallet-keypair.json");

// Carica il wallet keypair
const walletKeypair = anchor.web3.Keypair.fromSecretKey(
  Uint8Array.from(JSON.parse(fs.readFileSync(walletKeypairPath, "utf8")))
);

// Crea un oggetto wallet
const wallet = new anchor.Wallet(walletKeypair);

// Configura il provider
const connection = new Connection("https://api.devnet.solana.com", "confirmed");
const provider = new anchor.AnchorProvider(connection, wallet, {
  preflightCommitment: "confirmed", // Cambiato da "recent" a "confirmed"
});

// Imposta il provider
anchor.setProvider(provider);

// Crea l'istanza del programma combinando IDL, Program ID e provider
const program = new anchor.Program(idl, programId, provider);

// Funzione helper per ottenere il PDA dell'utente basato sull'UID
async function getUserPDA(uid) {
  const [userPDA, _] = await PublicKey.findProgramAddress(
    [Buffer.from(uid)],
    program.programId
  );
  return userPDA;
}

// Funzione per creare un nuovo account utente
async function creaUtente(uid, permessiIniziali) {
  const userPDA = await getUserPDA(uid);

  // Prepara i permessi iniziali
  const permissions = permessiIniziali.map((perm) => {
    return {
      areaId: perm.areaId,
      accessoConsentito: perm.accessoConsentito,
    };
  });

  // Transazione per creare l'account utente
  try {
    await program.rpc.creaUtente(uid, permissions, {
      accounts: {
        utente: userPDA,
        amministratore: wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [wallet.payer],
    });

    console.log(`Utente ${uid} creato con successo.`);
  } catch (err) {
    console.error("Errore durante la creazione dell'utente:", err);
  }
}

// Funzione per verificare l'accesso
async function verificaAccesso(uid, areaId) {
  const userPDA = await getUserPDA(uid);

  // Chiama il metodo verifica_accesso
  try {
    await program.rpc.verificaAccesso(areaId, {
      accounts: {
        utente: userPDA,
      },
    });

    // Leggi i dati dell'account utente per ottenere il risultato
    const userAccount = await program.account.utente.fetch(userPDA);
    const accessoConsentito = userAccount.ultimoEsito;

    if (accessoConsentito) {
      console.log(`Accesso consentito per l'utente ${uid} all'area ${areaId}.`);
    } else {
      console.log(`Accesso negato per l'utente ${uid} all'area ${areaId}.`);
    }

    return accessoConsentito;
  } catch (err) {
    console.error("Errore durante la verifica dell'accesso:", err);
  }
}

// Funzione per aggiornare i permessi
async function aggiornaPermessi(uid, nuoviPermessi) {
  const userPDA = await getUserPDA(uid);

  // Prepara i nuovi permessi
  const permissions = nuoviPermessi.map((perm) => {
    return {
      areaId: perm.areaId,
      accessoConsentito: perm.accessoConsentito,
    };
  });

  // Transazione per aggiornare i permessi
  try {
    await program.rpc.aggiornaPermessi(permissions, {
      accounts: {
        amministratore: wallet.publicKey,
        utente: userPDA,
      },
      signers: [wallet.payer],
    });

    console.log(`Permessi aggiornati con successo per l'utente ${uid}.`);
  } catch (err) {
    console.error("Errore durante l'aggiornamento dei permessi:", err);
  }
}

//Esempio di utilizzo:

(async () => {
  // UID per l'utente
  const uid = "4b1dc31";
  console.log(uid);

  // Permessi iniziali
  const permessiIniziali = [
    { areaId: 1, accessoConsentito: true },
    { areaId: 2, accessoConsentito: false },
  ];

  // Crea un nuovo utente
  await creaUtente(uid, permessiIniziali);
  console.log("Utente creato");

  // Verifica l'accesso all'area 1
  await verificaAccesso(uid, 1);

  // Verifica l'accesso all'area 2
  await verificaAccesso(uid, 2);

  // Aggiorna i permessi
  const nuoviPermessi = [
    { areaId: 1, accessoConsentito: true },
    { areaId: 2, accessoConsentito: true },
    { areaId: 3, accessoConsentito: false },
  ];

  await aggiornaPermessi(uid, nuoviPermessi);

  // Verifica l'accesso all'area 2 dopo l'aggiornamento dei permessi
  await verificaAccesso(uid, 2);

  // Verifica l'accesso all'area 3
  await verificaAccesso(uid, 3);
})();
