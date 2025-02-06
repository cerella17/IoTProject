<script setup lang="ts">
interface Utente {
  id: number;
  nome: string;
  email: string;
  ruolo: string;
  statoAccount: boolean;
}

const utenti = ref<Utente[]>([
  {
    id: 1,
    nome: "Mario Rossi",
    email: "mario.rossi@azienda.it",
    ruolo: "Amministratore",
    statoAccount: true,
  },
  {
    id: 2,
    nome: "Luigi Verdi",
    email: "luigi.verdi@azienda.it",
    ruolo: "Operatore",
    statoAccount: false,
  },
]);

const mostraModale = ref(false);
const nuovoUtente = ref({
  nome: "",
  email: "",
  ruolo: "Operatore",
  password: "",
});

const ruoli = ["Amministratore", "Operatore", "Supervisore"];

const aggiungiUtente = () => {
  // Qui implementeremo la logica di registrazione con better-auth
  console.log("Nuovo utente:", nuovoUtente.value);
  mostraModale.value = false;
};

const toggleStatoAccount = (utente: Utente) => {
  utente.statoAccount = !utente.statoAccount;
  // Qui implementeremo la logica per attivare/disattivare l'account
};
</script>

<template>
  <div class="space-y-6">
    <div class="flex items-center justify-between">
      <h1 class="text-2xl font-bold text-white">Gestione Utenti</h1>
      <button
        @click="mostraModale = true"
        class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
      >
        Aggiungi Utente
      </button>
    </div>

    <div class="overflow-hidden rounded-xl bg-[#1a1a1a] border border-white/5">
      <table class="w-full text-sm text-gray-300">
        <thead class="bg-[#0c0c0c]">
          <tr>
            <th class="px-6 py-4 font-medium text-left">ID</th>
            <th class="px-6 py-4 font-medium text-left">Nome</th>
            <th class="px-6 py-4 font-medium text-left">Email</th>
            <th class="px-6 py-4 font-medium text-left">Ruolo</th>
            <th class="px-6 py-4 font-medium text-center">Stato</th>
            <th class="px-6 py-4 font-medium text-center">Azioni</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-white/5">
          <tr
            v-for="utente in utenti"
            :key="utente.id"
            class="transition-colors hover:bg-white/5"
          >
            <td class="px-6 py-4">#{{ utente.id }}</td>
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
                {{ utente.nome }}
              </div>
            </td>
            <td class="px-6 py-4">{{ utente.email }}</td>
            <td class="px-6 py-4">
              <span
                class="px-3 py-1 text-xs font-medium rounded-full bg-white/10"
              >
                {{ utente.ruolo }}
              </span>
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-center">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-medium',
                    utente.statoAccount ? 'text-green-500' : 'text-red-500',
                  ]"
                >
                  {{ utente.statoAccount ? "Attivo" : "Disattivato" }}
                </span>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex justify-center gap-2">
                <button
                  @click="toggleStatoAccount(utente)"
                  class="p-1 rounded-lg hover:bg-white/10"
                  :title="utente.statoAccount ? 'Disattiva' : 'Attiva'"
                >
                  <Icon
                    :name="
                      utente.statoAccount
                        ? 'ic:baseline-block'
                        : 'ic:baseline-check-circle'
                    "
                    class="size-5"
                  />
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Modale per aggiungere nuovo utente -->
    <div
      v-if="mostraModale"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    >
      <div class="w-full max-w-md p-6 space-y-4 bg-[#1a1a1a] rounded-xl">
        <h2 class="text-xl font-bold text-white">Aggiungi Nuovo Utente</h2>
        <div class="space-y-4">
          <div>
            <label class="block mb-2 text-sm text-gray-400">Nome</label>
            <input
              v-model="nuovoUtente.nome"
              type="text"
              class="w-full px-3 py-2 bg-[#0c0c0c] rounded-lg border border-white/10"
            />
          </div>
          <div>
            <label class="block mb-2 text-sm text-gray-400">Email</label>
            <input
              v-model="nuovoUtente.email"
              type="email"
              class="w-full px-3 py-2 bg-[#0c0c0c] rounded-lg border border-white/10"
            />
          </div>
          <div>
            <label class="block mb-2 text-sm text-gray-400">Password</label>
            <input
              v-model="nuovoUtente.password"
              type="password"
              class="w-full px-3 py-2 bg-[#0c0c0c] rounded-lg border border-white/10"
            />
          </div>
          <div>
            <label class="block mb-2 text-sm text-gray-400">Ruolo</label>
            <select
              v-model="nuovoUtente.ruolo"
              class="w-full px-3 py-2 bg-[#0c0c0c] rounded-lg border border-white/10"
            >
              <option v-for="ruolo in ruoli" :key="ruolo" :value="ruolo">
                {{ ruolo }}
              </option>
            </select>
          </div>
        </div>
        <div class="flex justify-end gap-3 pt-4">
          <button
            @click="mostraModale = false"
            class="px-4 py-2 text-sm font-medium text-gray-400 rounded-lg hover:bg-white/10"
          >
            Annulla
          </button>
          <button
            @click="aggiungiUtente"
            class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Aggiungi
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
