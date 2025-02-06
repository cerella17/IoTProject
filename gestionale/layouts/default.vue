<script setup lang="ts">
const options = [
  {
    name: "Home",
    to: "/",
    icon: "ic:baseline-home",
  },
  {
    name: "Autorizzazioni",
    to: "/autorizzazioni",
    icon: "ic:sharp-manage-accounts",
  },
  {
    name: "Accessi",
    to: "/accessi",
    icon: "ic:round-security",
  },
];

const showSidebar = ref(false);
</script>

<template>
  <div class="flex min-h-screen bg-[#050505]">
    <!-- Sidebar -->
    <div
      :class="[
        'fixed left-0 top-0 h-full transition-all duration-300 ease-in-out',
        'bg-gradient-to-b from-[#1a1a1a] to-[#131313]',
        'border-r border-white/5',
        showSidebar ? 'w-[220px]' : 'w-[70px]',
        showSidebar ? 'translate-x-0' : '-translate-x-full md:translate-x-0',
      ]"
    >
      <div class="flex flex-col h-full p-4">
        <!-- Logo o titolo -->
        <div class="mb-8 text-center">
          <Icon name="ic:baseline-security" class="size-8 text-red-500" />
        </div>

        <!-- Menu items -->
        <div class="flex flex-col gap-4">
          <NuxtLink
            v-for="o in options"
            :key="o.to"
            :to="o.to"
            class="flex items-center justify-center transition-all p-2 rounded-lg hover:bg-white/5 group"
          >
            <Icon
              :name="o.icon"
              size="30px"
              class="text-gray-400 group-hover:text-red-500"
            />
          </NuxtLink>
        </div>
      </div>
    </div>

    <!-- Toggle button -->
    <button
      @click="showSidebar = !showSidebar"
      class="fixed top-4 left-4 z-50 p-2 transition-all rounded-lg md:hidden bg-[#1a1a1a] hover:bg-[#2a2a2a] text-white"
    >
      <Icon
        :name="showSidebar ? 'ic:round-close' : 'ic:round-menu'"
        class="size-6 text-gray-300"
      />
    </button>

    <!-- Main content -->
    <div :class="['flex-1 transition-all', 'md:ml-[70px]', 'p-6 md:p-8']">
      <slot />
    </div>
  </div>
</template>
