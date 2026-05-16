# IoT Access & Monitoring System

Sistema IoT per il monitoraggio ambientale e il controllo degli accessi RFID, con permessi gestiti su blockchain Solana.

## Panoramica

Il progetto integra dispositivi ESP32, un broker MQTT sicuro e una web app di gestione per:

- **Monitorare in tempo reale** sensori di temperatura e fumo
- **Controllare gli accessi** tramite tag RFID con autorizzazione su blockchain
- **Gestire i permessi** degli utenti per area tramite smart contract Solana

## Architettura

```
ESP32 (sensori + RFID)
        │
        │  MQTT over TLS (porta 8883)
        ▼
  Broker MQTT (Aedes)
        │
        │  HTTP REST
        ▼
  Nuxt.js API Server ◄──► PostgreSQL
        │
        │  RPC (Anchor)
        ▼
  Solana Devnet (smart contract permessi)
```

## Struttura del progetto

```
IoTProject/
├── gestionale/        # Web app Nuxt.js 3 (dashboard + API)
└── server-mqtt/       # Broker MQTT Node.js con TLS
```

## Stack tecnologico

| Layer | Tecnologia |
|---|---|
| Frontend | Nuxt.js 3, Vue 3, Tailwind CSS, Shadcn/Vue |
| Backend API | Nuxt Server Routes, TypeScript |
| Autenticazione | Better Auth |
| Database | PostgreSQL |
| Broker MQTT | Aedes (Node.js) con mTLS |
| Blockchain | Solana Devnet, Anchor Framework |
| IoT | ESP32 (C++, Arduino) |

## Funzionalità

### Dashboard
- Visualizzazione in tempo reale dei sensori di temperatura e fumo (aggiornamento ogni 2s)
- Log degli accessi RFID con esito di autorizzazione
- Indicatore stato sensore (attivo/inattivo)

### Gestione autorizzazioni RFID
- Lettura degli utenti dalla blockchain Solana
- Creazione e modifica permessi per area (Server Room, Magazzino)
- Aggiornamento permessi in tempo reale tramite smart contract

### Gestione utenti
- Creazione utenti con ruoli (Amministratore, Operatore, Supervisore)
- Attivazione/disattivazione account

### Broker MQTT
- Comunicazione sicura con mTLS (certificati CA, broker, client)
- Topic `rfid/data` → verifica autorizzazione su blockchain → risposta su `rfid/authorization`
- Topic `sensors/data` → inoltro dati a PostgreSQL via API REST

## Requisiti

- Node.js >= 18
- pnpm >= 9
- PostgreSQL
- Wallet Solana (devnet) con keypair admin

## Installazione

### 1. Web app (gestionale)

```bash
cd gestionale
pnpm install
```

Crea il file `.env` partendo da `.env.example`:

```env
BETTER_AUTH_SECRET=<stringa-segreta>
BETTER_AUTH_URL=http://localhost:3000
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
```

Aggiungi il file `blockchain/idl.json` (IDL del programma Anchor) e `blockchain/wallet-keypair-admin.json` (keypair admin Solana).

Avvia in sviluppo:

```bash
pnpm dev
```

### 2. Broker MQTT (server-mqtt)

```bash
cd server-mqtt
npm install
```

Assicurati di avere i certificati TLS nella directory:
- `ca.crt` — CA root
- `broker.crt` / `broker.key` — certificato broker
- `client.crt` / `client.key` — certificato client

Avvia il broker:

```bash
node server.js
```

Il broker si mette in ascolto sulla porta `8883` (MQTT over TLS).

### 3. ESP32

Apri `server-mqtt/mqtt_handler.cpp` con Arduino IDE o PlatformIO.

Configura:
- Credenziali WiFi (`ssid`, `password`)
- IP del broker MQTT (`mqtt_server`)
- Certificati TLS (CA, client cert, client key)

Flash sul dispositivo ESP32.

## Topic MQTT

| Topic | Direzione | Payload |
|---|---|---|
| `rfid/data` | ESP32 → Broker | Tag RFID (stringa) |
| `rfid/authorization` | Broker → ESP32 | `authorized` / `unauthorized` |
| `sensors/data` | ESP32 → Broker | JSON `{ device_id, temperature, smokeLevel }` |

## Smart contract Solana

Il programma Anchor gestisce:
- `creaUtente` — registra un utente RFID con permessi iniziali per area
- `aggiornaPermessi` — modifica i permessi di accesso per area
- `verificaAccesso` — verifica se un tag RFID è autorizzato per una determinata area

Program ID: `2mfaAWB2W9BXFS2DvyEZNK1UaVBNmwASFrEaDnB6GpeX` (Solana Devnet)

## Sicurezza

- Comunicazione MQTT protetta con mutual TLS (mTLS)
- API interne protette da API key (`x-api-key` header)
- Autenticazione web tramite Better Auth
- Permessi memorizzati on-chain su Solana (immutabili e verificabili)

> **Attenzione:** Prima di pubblicare il repository, rimuovere o invalidare i certificati presenti in `server-mqtt/` e ruotare il wallet keypair Solana.
