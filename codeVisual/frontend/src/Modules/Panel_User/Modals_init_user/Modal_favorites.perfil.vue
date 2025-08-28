<script setup lang="ts">
import { favoritesStore } from '@/store/favorites.store';
import { computed, onMounted } from 'vue';
import cardUserFavorites from './card.user.favorites.vue';
import { useProfesionalDetailStore } from '@/store';
import Swal from "sweetalert2";
const store_favorites = favoritesStore()
const detail_store = useProfesionalDetailStore()
const list_favorites = computed(() => store_favorites.list_favorites || []);
onMounted(() => {
  store_favorites.get_favorites();

});
const delete_favorite = async (id: string) => {
  const result = await Swal.fire({
    title: "¿Estás seguro?",
    text: "¡Esta acción eliminará el favorito!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "var(--blue-1)",
    cancelButtonColor: "#d33",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar"
  });

  if (result.isConfirmed) {
    try {
      await detail_store.delete_favorite(id);
      await store_favorites.get_favorites(); // Opcional: actualizar lista

      Swal.fire("¡Eliminado!", "El favorito fue eliminado con éxito.", "success");
    } catch (error) {
      Swal.fire("Error", "No se pudo eliminar el favorito.", "error");
    }
  }
};

</script>
<template>
  <div v-if="list_favorites.length" class="w-full   flex flex-col items-center  ">

    <cardUserFavorites @delete="delete_favorite" v-for="(item, index) in list_favorites" :data_card="item"
      :key="index" />

  </div>
</template>