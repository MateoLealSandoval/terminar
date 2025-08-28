<script setup lang="ts">
import { ref } from 'vue';
import { toast } from 'vue3-toastify';
import type { ServicesDto } from '@/dto/professional/Services-Dto';
import { usePofessionalStorage } from '@/store';

const emit = defineEmits(['close', 'update_user']);

const closeModal = () => {
  emit('update_user');
  emit('close');
};

const store_professional = usePofessionalStorage();
const name = ref('');
const price = ref(0);
const priceFormatted = ref('');

// Al escribir: solo permitir números
const handleInput = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const numericString = input.value.replace(/\D/g, ''); // solo dígitos
  price.value = Number(numericString);
  priceFormatted.value = numericString;
};

// Al salir del campo: aplicar formateo
const formatPrice = () => {
  if (price.value > 0) {
    priceFormatted.value = price.value.toLocaleString('de-DE'); // 1000000 → 1.000.000
  } else {
    priceFormatted.value = '';
  }
};

const create_service = async () => {
  try {
    if (name.value && price.value > 0) {
      const newService: ServicesDto = {
        name: name.value,
        price: price.value
      };
      await store_professional.create_service(newService);

      toast.success('Servicio creado exitosamente');
      closeModal();
    } else {
      toast.error('Faltan datos');
    }
  } catch (error) {
    toast.error('Error al crear un nuevo servicio');
    console.error(error);
  }
};
</script>
<template>
  <div class="modal font-poppins">
    <div class="modal-content text-xs">
      <h2 class="text-base mb-3">Agregar Servicios</h2>

      <div class="mb-5">
        <label class="text-gray-700 font-medium" for="nombre">Nombre del Servicio</label>
        <input
          id="nombre"
          v-model="name"
          type="text"
          placeholder="Nombre"
          class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
        />
      </div>

      <div class="mb-5">
        <label class="text-gray-700 font-medium" for="precio">Precio</label>
        <input
          id="precio"
          :value="priceFormatted"
          @input="handleInput"
          @blur="formatPrice"
          type="text"
          inputmode="numeric"
          placeholder="Precio"
          class="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-200 rounded-md focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40 focus:outline-none focus:ring"
        />
      </div>
    </div>

    <div class="w-full flex gap-x-4 mt-auto">
      <div class="w-1/2">
        <button
          class="w-full p-6 bg-[var(--blue-1)] text-white py-2 rounded-3xl cursor-pointer"
          @click="create_service"
        >
          Crear
        </button>
      </div>
      <div class="w-1/2">
        <button
          @click="closeModal"
          class="w-full border p-6 border-red-200 py-2 rounded-3xl"
        >
          Cancelar
        </button>
      </div>
    </div>
  </div>
</template>
