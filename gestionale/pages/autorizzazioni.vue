<script setup lang="ts">
interface Permesso {
  areaId: number;
  accessoConsentito: boolean;
}

interface Dipendente {
  uid: string;
  nome: string;
  permessi: Permesso[];
  pubkey: string;
}

const dipendenti = ref<Dipendente[]>([]);
const stanzeDisponibili = [
  { id: 1, nome: "Server Room" },
  { id: 2, nome: "Magazzino" },
];

// Variabili per gestire il modale
const mostraModale = ref(false);
const dipendenteSelezionato = ref<Dipendente | null>(null);

// Funzione per caricare i dipendenti dalla blockchain
const caricaDipendenti = async () => {
  try {
    const response = await fetch("/api/blockchain/get-all-users");
    const result = await response.json();
    if (result.success) {
      dipendenti.value = result.data;
    }
  } catch (error) {
    console.error("Errore nel caricamento dei dipendenti:", error);
  }
};

// Carica i dipendenti all'avvio
onMounted(() => {
  caricaDipendenti();
});

// Funzione per ottenere le stanze autorizzate di un dipendente
const getStanzeAutorizzate = (permessi: Permesso[]) => {
  return permessi
    .filter((p) => p.accessoConsentito)
    .map((p) => stanzeDisponibili.find((s) => s.id === p.areaId)?.nome)
    .filter(Boolean);
};

// Funzione per aprire il modale
const apriModale = (dipendente?: Dipendente) => {
  if (dipendente) {
    // Crea una copia profonda del dipendente
    dipendenteSelezionato.value = JSON.parse(JSON.stringify(dipendente));

    // Assicurati che tutti i permessi siano presenti
    stanzeDisponibili.forEach((stanza) => {
      const permessoEsistente = dipendenteSelezionato.value.permessi.find(
        (p) => p.areaId === stanza.id
      );
      if (!permessoEsistente) {
        dipendenteSelezionato.value.permessi.push({
          areaId: stanza.id,
          accessoConsentito: false,
        });
      }
    });
  } else {
    // Crea un nuovo dipendente con tutti i permessi inizializzati
    dipendenteSelezionato.value = {
      uid: "",
      nome: "",
      permessi: stanzeDisponibili.map((stanza) => ({
        areaId: stanza.id,
        accessoConsentito: false,
      })),
      pubkey: "",
    };
  }
  mostraModale.value = true;
};

// Modifica la funzione salvaModifiche per il nuovo formato
const salvaModifiche = async () => {
  if (!dipendenteSelezionato.value) return;

  try {
    const stanzeIds = dipendenteSelezionato.value.permessi
      .filter((p) => p.accessoConsentito)
      .map((p) => p.areaId);

    await fetch("/api/blockchain/update-permissions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        rfid: dipendenteSelezionato.value.uid,
        stanze: stanzeIds,
      }),
    });

    await caricaDipendenti();
    mostraModale.value = false;
  } catch (error) {
    console.error("Errore nel salvataggio:", error);
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
            <th class="px-6 py-4 font-medium text-left">RFID</th>
            <th class="px-6 py-4 font-medium text-left">Nome</th>
            <th class="px-6 py-4 font-medium text-left">Stanze Autorizzate</th>
            <th class="px-6 py-4 font-medium text-center">Azioni</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr
            v-for="dipendente in dipendenti"
            :key="dipendente.uid"
            class="transition-colors hover:bg-white/5"
          >
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <Icon
                  name="mdi:card-account-details"
                  class="size-5 text-gray-500"
                />
                {{ dipendente.uid }}
              </div>
            </td>
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
                {{ dipendente.nome }}
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex flex-wrap gap-2">
                <span
                  v-for="stanza in getStanzeAutorizzate(dipendente.permessi)"
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
            {{ dipendenteSelezionato?.uid ? "Modifica" : "Nuovo" }} Dipendente
          </h2>
          <button @click="chiudiModale" class="p-2 rounded-lg hover:bg-white/5">
            <Icon name="ic:baseline-close" class="size-6 text-gray-400" />
          </button>
        </div>

        <div class="space-y-4">
          <div>
            <label class="block mb-2 text-sm text-gray-400">RFID</label>
            <input
              v-model="dipendenteSelezionato.uid"
              type="text"
              class="w-full px-4 py-2 rounded-lg bg-[#0c0c0c] border border-white/5 text-white focus:outline-none focus:border-red-500"
            />
          </div>

          <div>
            <label class="block mb-2 text-sm text-gray-400">Nome</label>
            <input
              v-model="dipendenteSelezionato.nome"
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
                :key="stanza.id"
                class="flex items-center gap-2"
              >
                <input
                  type="checkbox"
                  :id="'stanza-' + stanza.id"
                  v-model="
                    dipendenteSelezionato.permessi[stanza.id - 1]
                      .accessoConsentito
                  "
                  class="rounded border-white/5 bg-[#0c0c0c] text-red-500 focus:ring-red-500"
                />
                <label
                  :for="'stanza-' + stanza.id"
                  class="text-sm text-gray-300"
                >
                  {{ stanza.nome }}
                </label>
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
