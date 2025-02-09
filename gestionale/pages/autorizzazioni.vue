<script setup lang="ts">
interface Dipendente {
  id: number;
  nome: string;
  cognome: string;
  rfid: string;
  stanze: string[];
}

const dipendenti = ref<Dipendente[]>([
  {
    id: 1,
    nome: "Mario",
    cognome: "Rossi",
    rfid: "A1B2C3D4",
    stanze: ["Server Room", "Magazzino"],
  },
  {
    id: 2,
    nome: "Giovanni",
    cognome: "Bianchi",
    rfid: "E5F6G7H8",
    stanze: ["Magazzino"],
  },
  {
    id: 3,
    nome: "Elisa",
    cognome: "Verdi",
    rfid: "I9J0K1L2",
    stanze: ["Server Room"],
  },
]);

const stanzeDisponibili = ["Server Room", "Magazzino"];

// Variabili per gestire il modale
const mostraModale = ref(false);
const dipendenteSelezionato = ref<Dipendente | null>(null);

// Funzione per aprire il modale
const apriModale = (dipendente?: Dipendente) => {
  if (dipendente) {
    dipendenteSelezionato.value = { ...dipendente };
  } else {
    dipendenteSelezionato.value = {
      id: dipendenti.value.length + 1,
      nome: "",
      cognome: "",
      rfid: "",
      stanze: [],
    };
  }
  mostraModale.value = true;
};

// Funzione per salvare le modifiche
const salvaModifiche = async () => {
  if (!dipendenteSelezionato.value) return;

  try {
    const index = dipendenti.value.findIndex(
      (d) => d.id === dipendenteSelezionato.value?.id
    );

    if (index === -1) {
      // Nuovo dipendente
      await fetch("/api/blockchain/create-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rfid: dipendenteSelezionato.value.rfid,
          nome: `${dipendenteSelezionato.value.nome} ${dipendenteSelezionato.value.cognome}`,
          stanze: dipendenteSelezionato.value.stanze,
        }),
      });

      dipendenti.value.push(dipendenteSelezionato.value);
    } else {
      // Aggiornamento dipendente esistente
      await fetch("/api/blockchain/update-permissions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          rfid: dipendenteSelezionato.value.rfid,
          stanze: dipendenteSelezionato.value.stanze,
        }),
      });

      dipendenti.value[index] = dipendenteSelezionato.value;
    }

    mostraModale.value = false;
  } catch (error) {
    console.error("Errore nel salvataggio:", error);
    // Qui potresti aggiungere una notifica di errore all'utente
  }
};

// Funzione per chiudere il modale
const chiudiModale = () => {
  mostraModale.value = false;
  dipendenteSelezionato.value = null;
};

// Aggiungiamo una funzione per ottenere il colore del livello di autorizzazione
const getLivelloColor = (livello: string) => {
  switch (livello.toLowerCase()) {
    case "admin":
      return "text-red-500";
    case "superuser":
      return "text-blue-500";
    default:
      return "text-gray-400";
  }
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">
        Gestione Autorizzazioni RFID
      </h1>
      <button
        @click="apriModale()"
        class="px-4 py-2 text-sm font-medium transition-all rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20"
      >
        <Icon name="ic:baseline-person-add" class="size-5" />
      </button>
    </div>

    <div class="overflow-hidden rounded-xl bg-[#1a1a1a] border border-white/5">
      <table class="w-full text-sm text-gray-300">
        <thead class="bg-[#0c0c0c]">
          <tr>
            <th class="px-6 py-4 font-medium text-left">ID</th>
            <th class="px-6 py-4 font-medium text-left">Nome</th>
            <th class="px-6 py-4 font-medium text-left">RFID</th>
            <th class="px-6 py-4 font-medium text-left">Stanze Autorizzate</th>
            <th class="px-6 py-4 font-medium text-center">Azioni</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr
            v-for="dipendente in dipendenti"
            :key="dipendente.id"
            class="transition-colors hover:bg-white/5"
          >
            <td class="px-6 py-4">#{{ dipendente.id }}</td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-3">
                <div
                  class="flex items-center justify-center p-1 rounded-lg bg-white/5"
                >
                  <Icon
                    name="ic:baseline-person"
                    class="size-5 text-gray-400"
                  />
                </div>
                {{ dipendente.nome }} {{ dipendente.cognome }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <Icon
                  name="mdi:card-account-details"
                  class="size-5 text-gray-500"
                />
                {{ dipendente.rfid }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="stanza in dipendente.stanze"
                  :key="stanza"
                  class="px-2 py-1 text-xs font-medium rounded-full bg-red-500/10 text-red-500"
                >
                  {{ stanza }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center justify-center gap-2">
                <button
                  @click="apriModale(dipendente)"
                  class="p-2 transition-colors rounded-lg hover:bg-white/5"
                >
                  <Icon
                    name="ic:baseline-edit"
                    class="size-5 text-gray-400 hover:text-red-500"
                  />
                </button>
                <button
                  class="p-2 transition-colors rounded-lg hover:bg-white/5"
                >
                  <Icon
                    name="ic:baseline-delete"
                    class="size-5 text-gray-400 hover:text-red-500"
                  />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modal -->
    <div
      v-if="mostraModale"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div
        class="w-full max-w-md p-6 space-y-4 rounded-xl bg-[#1a1a1a] border border-white/5"
      >
        <div class="flex items-center justify-between">
          <h2 class="text-xl font-bold text-white">
            {{ dipendenteSelezionato?.id ? "Modifica" : "Nuovo" }} Dipendente
          </h2>
          <button @click="chiudiModale" class="p-2 rounded-lg hover:bg-white/5">
            <Icon name="ic:baseline-close" class="size-6 text-gray-400" />
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block mb-2 text-sm text-gray-400">Nome</label>
            <input
              v-model="dipendenteSelezionato!.nome"
              type="text"
              class="w-full px-4 py-2 rounded-lg bg-[#0c0c0c] border border-white/5 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label class="block mb-2 text-sm text-gray-400">Cognome</label>
            <input
              v-model="dipendenteSelezionato!.cognome"
              type="text"
              class="w-full px-4 py-2 rounded-lg bg-[#0c0c0c] border border-white/5 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label class="block mb-2 text-sm text-gray-400">RFID</label>
            <input
              v-model="dipendenteSelezionato!.rfid"
              type="text"
              class="w-full px-4 py-2 rounded-lg bg-[#0c0c0c] border border-white/5 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label class="block mb-2 text-sm text-gray-400"
              >Stanze Autorizzate</label
            >
            <div class="space-y-2">
              <div
                v-for="stanza in stanzeDisponibili"
                :key="stanza"
                class="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  :id="stanza"
                  :value="stanza"
                  v-model="dipendenteSelezionato!.stanze"
                  class="rounded border-white/5 bg-[#0c0c0c] text-red-500 focus:ring-red-500"
                />
                <label :for="stanza" class="text-sm text-gray-300">{{
                  stanza
                }}</label>
              </div>
            </div>
          </div>
        </div>

        <div class="flex justify-end gap-3 pt-4">
          <button
            @click="chiudiModale"
            class="px-4 py-2 text-sm font-medium transition-colors rounded-lg text-gray-300 hover:bg-white/5"
          >
            Annulla
          </button>
          <button
            @click="salvaModifiche"
            class="px-4 py-2 text-sm font-medium transition-colors rounded-lg bg-red-500/10 text-red-500 hover:bg-red-500/20"
          >
            Salva
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
