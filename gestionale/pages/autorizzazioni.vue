<script setup lang="ts">
const dipendenti = ref([
  {
    id: 1,
    nome: "Mario Rossi",
    livelloAutorizzazione: "Admin",
    stanza: "Server Room",
  },
  {
    id: 2,
    nome: "Giovanni Bianchi",
    livelloAutorizzazione: "User",
    stanza: "Magazzino",
  },
  {
    id: 3,
    nome: "Elisa Verdi",
    livelloAutorizzazione: "SuperUser",
    stanza: "Sala Riunioni",
  },
]);

// Variabili per gestire il modale
const mostraModale = ref(false);
const dipendenteSelezionato = ref<any>(null); // Puoi tipizzare meglio se preferisci

// Funzione per aprire il modale
const apriModale = (dipendente: any) => {
  dipendenteSelezionato.value = { ...dipendente }; // Copia dell'oggetto per evitare modifiche dirette
  mostraModale.value = true;
};

// Funzione per salvare le modifiche
const salvaModifiche = () => {};

// Funzione per chiudere il modale senza salvare
const chiudiModale = () => {
  mostraModale.value = false;
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
      <h1 class="text-2xl font-bold text-white">Gestione Autorizzazioni</h1>
      <button
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
            <th class="px-6 py-4 font-medium text-left">Livello</th>
            <th class="px-6 py-4 font-medium text-left">Stanza</th>
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
                {{ dipendente.nome }}
              </div>
            </td>
            <td class="px-6 py-4">
              <span
                :class="[
                  'px-3 py-1 rounded-full text-xs font-medium',
                  getLivelloColor(dipendente.livelloAutorizzazione),
                ]"
              >
                {{ dipendente.livelloAutorizzazione }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-2">
                <Icon
                  name="ic:baseline-meeting-room"
                  class="size-5 text-gray-500"
                />
                {{ dipendente.stanza }}
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
          <h2 class="text-xl font-bold text-white">Modifica Autorizzazione</h2>
          <button @click="chiudiModale" class="p-2 rounded-lg hover:bg-white/5">
            <Icon name="ic:baseline-close" class="size-6 text-gray-400" />
          </button>
        </div>

        <div class="space-y-4">
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
              >Livello Autorizzazione</label
            >
            <select
              v-model="dipendenteSelezionato.livelloAutorizzazione"
              class="w-full px-4 py-2 rounded-lg bg-[#0c0c0c] border border-white/5 text-white focus:outline-none focus:border-red-500"
            >
              <option value="Admin">Admin</option>
              <option value="SuperUser">SuperUser</option>
              <option value="User">User</option>
            </select>
          </div>

          <div>
            <label class="block mb-2 text-sm text-gray-400">Stanza</label>
            <input
              v-model="dipendenteSelezionato.stanza"
              type="text"
              class="w-full px-4 py-2 rounded-lg bg-[#0c0c0c] border border-white/5 text-white focus:outline-none focus:border-red-500"
            />
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
