<template>
  <div class="min-h-screen p-6 text-white bg-[#0a0a0a]">
    <h1 class="mb-6 text-2xl font-bold">Dashboard</h1>
    <div class="grid grid-cols-2 gap-6">
      <!-- Card 1 -->
      <div
        class="bg-gradient-to-br from-[#1a1a1a] to-[#131313] p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 md:col-span-1 col-span-2"
      >
        <div class="flex items-center mb-4">
          <Icon name="mdi:thermometer" class="mr-2 text-blue-400 size-6" />
          <h2 class="text-xl font-semibold">Sensori Di temperatura</h2>
        </div>
        <ul class="space-y-3">
          <li
            v-for="sensore in sensoriTemp"
            class="flex justify-between p-3 rounded-lg bg-[#0c0c0c]/50"
          >
            <div class="flex items-center space-x-2">
              <Icon name="mdi:server" class="text-gray-400 size-5" />
              <span class="text-gray-300">{{ sensore.nome }}</span>
              <Icon
                v-if="sensore.stato == 'online'"
                name="ci:dot-05-xl"
                class="text-green-500 size-5"
              />
              <Icon
                v-else-if="sensore.stato == 'offline'"
                name="ci:dot-05-xl"
                class="text-red-600 size-5"
              />
            </div>
            <span class="font-medium text-blue-400"
              >{{ sensore.temperatura }}°C</span
            >
          </li>
        </ul>
      </div>

      <!-- Card 2 -->
      <div
        class="bg-gradient-to-br from-[#1a1a1a] to-[#131313] p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 md:col-span-1 col-span-2"
      >
        <div class="flex items-center mb-4">
          <Icon name="mdi:smoke-detector" class="mr-2 text-orange-400 size-6" />
          <h2 class="text-xl font-semibold">Sensore di fumo</h2>
        </div>
        <ul class="space-y-3">
          <li
            v-for="sensore in sensoriFumo"
            class="flex justify-between p-3 rounded-lg bg-[#0c0c0c]/50"
          >
            <div class="flex items-center space-x-2">
              <Icon name="mdi:smoke" class="text-gray-400 size-5" />
              <span class="text-gray-300">{{ sensore.nome }}</span>
              <Icon
                v-if="sensore.stato == 'online'"
                name="ci:dot-05-xl"
                class="text-green-500 size-5"
              />
              <Icon
                v-else-if="sensore.stato == 'offline'"
                name="ci:dot-05-xl"
                class="text-red-600 size-5"
              />
            </div>
          </li>
        </ul>
      </div>

      <!-- Card 3 -->
      <div
        class="bg-gradient-to-br from-[#1a1a1a] to-[#131313] p-6 rounded-xl shadow-xl hover:shadow-2xl transition-all duration-300 col-span-2"
      >
        <div class="flex items-center mb-4">
          <Icon
            name="mdi:card-account-details"
            class="mr-2 text-purple-400 size-6"
          />
          <h2 class="text-xl font-semibold">Sensore RFID - Accessi</h2>
        </div>
        <div class="overflow-x-auto rounded-lg">
          <table
            class="w-full text-sm text-left text-gray-300 border-separate border-spacing-0"
          >
            <thead class="bg-[#0c0c0c]">
              <tr>
                <th class="p-4 font-medium border-b border-gray-700">ID</th>
                <th class="p-4 font-medium border-b border-gray-700">Nome</th>
                <th class="p-4 font-medium border-b border-gray-700">Stanza</th>
                <th
                  class="p-4 font-medium text-center border-b border-gray-700"
                >
                  Autorizzazione
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="autorizzazione in autorizzazioni"
                :key="autorizzazione.id"
                class="hover:bg-[#0c0c0c]/50 transition-colors"
              >
                <td class="p-4 border-b border-gray-700/50">
                  {{ autorizzazione.id }}
                </td>
                <td class="p-4 border-b border-gray-700/50">
                  {{ autorizzazione.nome }}
                </td>
                <td class="p-4 border-b border-gray-700/50">
                  {{ autorizzazione.stanza }}
                </td>
                <td class="p-4 text-center border-b border-gray-700/50">
                  <Icon
                    v-if="autorizzazione.autorizzata"
                    name="mdi:check-circle"
                    class="text-green-500 size-5"
                  />
                  <Icon
                    v-else
                    name="mdi:close-circle"
                    class="text-red-600 size-5"
                  />
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
