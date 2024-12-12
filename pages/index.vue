<template>
  <div class="text-white">
    <h1 class="text-lg">Dashboard</h1>
    <div class="grid grid-cols-2 gap-4">
      <!-- Card 1 -->
      <div
        class="bg-[#131313] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow md:col-span-1 col-span-2"
      >
        <h2 class="mb-2 text-lg font-semibold">Sensori Di temperatura</h2>
        <ul class="">
          <li v-for="sensore in sensoriTemp" class="flex justify-between">
            <div class="flex items-center justify-center">
              <span class="text-sm text-gray-400">{{ sensore.nome }}</span>
              <Icon
                v-if="sensore.stato == 'online'"
                name="ci:dot-05-xl"
                class="text-green-500 size-6"
              />
              <Icon
                v-else-if="sensore.stato == 'offline'"
                name="ci:dot-05-xl"
                class="text-red-600 size-6"
              />
            </div>
            <span class="text-sm text-gray-400">Temperatura: {{ sensore.temperatura }}°C</span>
          </li>
        </ul>
      </div>

      <!-- Card 2 -->
      <div
        class="bg-[#131313] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow md:col-span-1 col-span-2"
      >
        <h2 class="mb-2 text-lg font-semibold">Sensore di fumo</h2>
        <ul class="">
          <li v-for="sensore in sensoriFumo" class="flex justify-between">
            <div class="flex items-center justify-center">
              <span class="text-sm text-gray-400">{{ sensore.nome }}</span>
              <Icon
                v-if="sensore.stato == 'online'"
                name="ci:dot-05-xl"
                class="text-green-500 size-6"
              />
              <Icon
                v-else-if="sensore.stato == 'offline'"
                name="ci:dot-05-xl"
                class="text-red-600 size-6"
              />
            </div>
          </li>
        </ul>
      </div>

      <!-- Card 3 -->
      <div
        class="bg-[#131313] p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow col-span-2"
      >
        <h2 class="mb-4 text-lg font-semibold">Sensore RFID - Accessi</h2>
        <div class="overflow-x-auto">
          <table
            class="w-full text-sm text-left text-gray-400 border border-collapse border-gray-700 table-auto"
          >
            <thead class="text-gray-300 bg-gray-800">
              <tr>
                <th class="px-4 py-2 border border-gray-700">ID</th>
                <th class="px-4 py-2 border border-gray-700">Nome</th>
                <th class="px-4 py-2 border border-gray-700">Stanza</th>
                <th class="px-4 py-2 text-center border border-gray-700">Autorizzazione</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="autorizzazione in autorizzazioni" :key="autorizzazione.id">
                <td class="px-4 py-2 border border-gray-700">{{ autorizzazione.id }}</td>
                <td class="px-4 py-2 border border-gray-700">{{ autorizzazione.nome }}</td>
                <td class="px-4 py-2 border border-gray-700">{{ autorizzazione.stanza }}</td>
                <td class="px-4 py-2 text-center border border-gray-700">
                  <Icon
                    v-if="autorizzazione.autorizzata"
                    name="ci:dot-05-xl"
                    class="text-green-500 size-6"
                  />
                  <Icon v-else name="ci:dot-05-xl" class="text-red-600 size-6" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
const sensoriTemp = [
  {
    id: 1,
    nome: "Stanza Server",
    temperatura: 25,
    stato: "online",
  },
  {
    id: 2,
    nome: "Sensore 2",
    temperatura: 30,
    stato: "offline",
  },
];

const sensoriFumo = [
  {
    id: 1,
    nome: "Sensore Fumo 1",
    stato: "online",
  },
  {
    id: 2,
    nome: "Sensore Fumo 2",
    stato: "offline",
  },
];

const autorizzazioni = [
  {
    id: 1,
    nome: "Admin",
    stanza: "Server",
    autorizzata: true,
  },
  {
    id: 2,
    nome: "Giovanni",
    stanza: "Magazzino",
    autorizzata: false,
  },
  {
    id: 3,
    nome: "Marco",
    stanza: "Sala riunioni",
    autorizzata: true,
  },
  {
    id: 4,
    nome: "Luca",
    stanza: "Ufficio",
    autorizzata: false,
  },
  {
    id: 5,
    nome: "Giulia",
    stanza: "Cucina",
    autorizzata: true,
  },
  {
    id: 6,
    nome: "Alessia",
    stanza: "Bagno",
    autorizzata: false,
  },
];
</script>
