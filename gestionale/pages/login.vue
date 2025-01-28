<script setup lang="ts">
import { signIn, signUp } from "~/lib/auth-client.js";

definePageMeta({
  // @ts-ignore
  layout: "empty",
});

const email = ref("");
const password = ref("");
const error = ref("");

const handleSignIn = async () => {
  await signIn.email(
    {
      email: email.value,
      password: password.value,
      callbackURL: "/",
    },
    {
      onError(context) {
        error.value = context.error.message;
      },
    }
  );
};

// const handleSignUp = async () => {
//   const { data, error } = await signUp.email({
//     email: "mattiaguariglia02@gmail.com",
//     password: "mattia123",
//     name: "mattia",
//   });
// };
</script>

<template>
  <div class="flex items-center justify-center min-h-screen">
    <div class="w-full max-w-md p-8 space-y-6 bg-[#131313] rounded-lg">
      <h1 class="text-2xl font-bold text-center text-white">Accesso</h1>

      <form @submit.prevent="handleSignIn" class="space-y-4">
        <div>
          <label class="block mb-2 text-sm text-gray-300">Email</label>
          <input
            v-model="email"
            type="email"
            required
            class="w-full px-3 py-2 text-white bg-[#050505] rounded-md focus:outline-none focus:ring-2 focus:ring-red-600/60"
          />
        </div>

        <div>
          <label class="block mb-2 text-sm text-gray-300">Password</label>
          <input
            v-model="password"
            type="password"
            required
            class="w-full px-3 py-2 text-white bg-[#050505] rounded-md focus:outline-none focus:ring-2 focus:ring-red-600/60"
          />
        </div>

        <p v-if="error" class="text-sm text-red-500">{{ error }}</p>

        <button
          type="submit"
          class="w-full px-4 py-2 text-white transition-colors bg-red-600/60 rounded-md hover:bg-red-700/60"
        >
          Accedi
        </button>
      </form>
    </div>
  </div>
</template>
