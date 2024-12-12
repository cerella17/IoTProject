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
</script>

<template>
  <div class="relative overflow-x-auto">
    <table
      class="w-full text-sm text-left text-gray-400 border border-collapse border-gray-700 table-auto"
    >
      <thead class="text-gray-300 bg-gray-800">
        <tr>
          <th class="px-4 py-2 border border-gray-700">ID</th>
          <th class="px-4 py-2 border border-gray-700">Nome</th>
          <th class="px-4 py-2 border border-gray-700">Livello Autorizzazione</th>
          <th class="px-4 py-2 border border-gray-700">Stanza</th>
          <th class="px-4 py-2 text-center border border-gray-700">Azioni</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="dipendente in dipendenti" :key="dipendente.id">
          <td class="px-4 py-2 border border-gray-700">{{ dipendente.id }}</td>
          <td class="px-4 py-2 border border-gray-700">{{ dipendente.nome }}</td>
          <td class="px-4 py-2 border border-gray-700">{{ dipendente.livelloAutorizzazione }}</td>
          <td class="px-4 py-2 border border-gray-700">{{ dipendente.stanza }}</td>
          <td class="px-4 py-2 text-center border border-gray-700">
            <button @click="apriModale(dipendente)">
              <Icon
                name="ic:baseline-more-horiz"
                class="cursor-pointer size-6 hover:text-red-600"
              />
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
