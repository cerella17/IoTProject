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
];

const showSidebar = ref(false);
</script>

<template>
  <div class="flex">
    <div
      :class="[
        'sticky md:w-[4vw] h-screen py-8 bg-[#131313] text-white rounded-lg w-[10vw]',
        showSidebar ? 'block' : 'hidden',
        'md:block',
      ]"
    >
      <div class="flex flex-col w-full items-center justify-center gap-6">
        <NuxtLink v-for="o in options" :to="o.to">
          <Icon :name="o.icon" class="size-6 hover:text-red-600/60" />
        </NuxtLink>
      </div>
    </div>
    <button
      @click="showSidebar = !showSidebar"
      class="md:hidden fixed top-4 right-4 z-50 p-2 rounded-lg bg-[#131313] text-white"
    >
      <Icon :name="showSidebar ? 'ic:round-close' : 'ic:round-menu'" class="size-6" />
    </button>
    <div class="w-full md:p-8 bg-[#050505] p-10">
      <slot />
    </div>
  </div>
</template>
