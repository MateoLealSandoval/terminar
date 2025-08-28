<!-- components/GoogleMap.vue -->
<template>
  <div class="google-map" ref="mapElement"></div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
const mapElement = ref(null);
const props = defineProps({
  latitude: {
    type: Number,
    required: true
  },
  longitude: {
    type: Number,
    required: true
  },
  title: {
    type: String,
    default: 'Ubicación'
  },
  description: {
    type: String,
    default: 'Descripción del lugar'
  }
});


onMounted(async () => {
  await loadGoogleMapsApi();

  const map = new window.google.maps.Map(mapElement.value, {
    center: { lat: props.latitude, lng: props.longitude }, // Medellín
    zoom: 12,
  });

  const marker = new window.google.maps.Marker({
    position: { lat: props.latitude, lng: props.longitude}, // Parque Arví
    map: map,
    title: props.title,
  });

  const infoWindow = new window.google.maps.InfoWindow({
    content: `<h3>${props.title}</h3><p>${props.description}</p>`,
  });

  marker.addListener('click', () => {
    infoWindow.open(map, marker);
  });
});

// 👇 Este cierre estaba mal posicionado
function loadGoogleMapsApi() {
  return new Promise((resolve, reject) => {
    if (window.google && window.google.maps) {
      resolve();
    } else {
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC8nT7qj-zeSinnptAAHaqDrqnxitAOPAU`; // Reemplaza con tu API Key
      script.async = true;
      script.defer = true;
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    }
  });
}
</script>

<style scoped>
.google-map {
  width: 100%;
  height: 400px;
}
</style>

<style scoped>
.google-map {
  width: 100%;
  height: 400px;
}
</style>