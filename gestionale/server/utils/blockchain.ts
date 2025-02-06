import { Connection, PublicKey, SystemProgram } from "@solana/web3.js";
import * as anchor from "@project-serum/anchor";
import fs from "fs";
import path from "path";

// Configurazione della connessione Solana
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

// Carica l'IDL
const idl = JSON.parse(
  fs.readFileSync(path.join(process.cwd(), "blockchain", "idl.json"), "utf8")
);

// Program ID della blockchain
const programId = new PublicKey("2mfaAWB2W9BXFS2DvyEZNK1UaVBNmwASFrEaDnB6GpeX");

// Carica il wallet keypair
const walletKeypair = anchor.web3.Keypair.fromSecretKey(
  Uint8Array.from(
    JSON.parse(
      fs.readFileSync(
        path.join(process.cwd(), "blockchain", "wallet-keypair-admin.json"),
        "utf8"
      )
    )
  )
);

// Configura il provider
const wallet = new anchor.Wallet(walletKeypair);
const provider = new anchor.AnchorProvider(connection, wallet, {
  preflightCommitment: "confirmed",
});

// Imposta il provider globale
anchor.setProvider(provider);

// Crea l'istanza del programma
const program = new anchor.Program(idl, programId, provider);

// Funzione helper per ottenere il PDA dell'admin
async function getAdminStatePDA(): Promise<PublicKey> {
  const [adminStatePDA] = await PublicKey.findProgramAddress(
    [Buffer.from("admin")],
    program.programId
  );
  return adminStatePDA;
}

// Funzione helper per ottenere il PDA dell'utente
async function getUserPDA(uid: string): Promise<PublicKey> {
  const [userPDA] = await PublicKey.findProgramAddress(
    [Buffer.from(uid)],
    program.programId
  );
  return userPDA;
}

export async function createBlockchainUser(
  rfid: string,
  nome: string,
  stanze: string[]
) {
  try {
    const userPDA = await getUserPDA(rfid);
    const adminStatePDA = await getAdminStatePDA();

    const permessiIniziali = stanze.map((_, index) => ({
      areaId: index + 1,
      accessoConsentito: true,
    }));

    const txSignature = await program.methods
      .creaUtente(rfid, nome, permessiIniziali)
      .accounts({
        utente: userPDA,
        amministratore: wallet.publicKey,
        adminState: adminStatePDA,
        systemProgram: SystemProgram.programId,
      })
      .signers([walletKeypair])
      .rpc();

    console.log(
      `Utente ${rfid} (${nome}) creato con successo sulla blockchain`
    );
    console.log("Transaction signature:", txSignature);
    return true;
  } catch (error) {
    console.error("Errore nella creazione utente sulla blockchain:", error);
    throw error;
  }
}

export async function updateBlockchainPermissions(
  rfid: string,
  stanze: string[]
) {
  try {
    const userPDA = await getUserPDA(rfid);
    const adminStatePDA = await getAdminStatePDA();

    const nuoviPermessi = stanze.map((_, index) => ({
      areaId: index + 1,
      accessoConsentito: true,
    }));

    const txSignature = await program.methods
      .aggiornaPermessi(nuoviPermessi)
      .accounts({
        amministratore: wallet.publicKey,
        utente: userPDA,
        adminState: adminStatePDA,
      })
      .signers([walletKeypair])
      .rpc();

    console.log(`Permessi aggiornati con successo per l'utente ${rfid}`);
    console.log("Transaction signature:", txSignature);
    return true;
  } catch (error) {
    console.error(
      "Errore nell'aggiornamento permessi sulla blockchain:",
      error
    );
    throw error;
  }
}

export async function verifyBlockchainAccess(rfid: string, areaId: number) {
  const userPDA = await getUserPDA(rfid);

  try {
    const txSignature = await program.rpc.verificaAccesso("user123", 1, {
      accounts: {
        utente: userPDA,
      },
    });

    console.log("Transaction signature:", txSignature);

    return true;
  } catch (error) {
    console.error("Errore durante la verifica dell'accesso:", error);
    throw error;
  }
}
