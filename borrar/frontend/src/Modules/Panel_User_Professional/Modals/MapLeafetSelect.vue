<!-- components/MapGoogleSelect.vue -->
<template>
    <div class="h-96">
        <div ref="mapElement" class="h-full w-full"></div>
    </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    address: { type: String, required: true }
});

const emit = defineEmits(['update:latitude', 'update:longitude', 'update:address','update:city','update:departament']);

const mapElement = ref(null);
let map, marker, geocoder;

const loadGoogleMapsApi = () => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
 
    return new Promise((resolve, reject) => {
        if (window.google && window.google.maps) {
            resolve();
        } else {
            const script = document.createElement('script');
            script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyC8nT7qj-zeSinnptAAHaqDrqnxitAOPAU`;
            script.async = true;
            script.defer = true;
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
        }
    });
};

const fetchAddress = (lat, lng) => {
    if (!geocoder) return;
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results[0]) {
            const components = results[0].address_components;

            const department = components.find(comp =>
                comp.types.includes('administrative_area_level_1')
            );

            const city = components.find(comp =>
                comp.types.includes('locality') || comp.types.includes('administrative_area_level_2')
            );

            const formatted = results[0].formatted_address;
            emit('update:departament', department?.long_name);
            emit('update:address', formatted);
            emit('update:city', city?.long_name);
        } else {
            emit('update:address', 'Ubicación desconocida');
        }
    });
};


onMounted(async () => {
    await loadGoogleMapsApi();

    geocoder = new window.google.maps.Geocoder();

    const center = { lat: props.latitude, lng: props.longitude };

    map = new window.google.maps.Map(mapElement.value, {
        center,
        zoom: 14
    });

    marker = new window.google.maps.Marker({
        position: center,
        map,
        draggable: true
    });

    fetchAddress(center.lat, center.lng);

    map.addListener('click', (e) => {
        const lat = e.latLng.lat();
        const lng = e.latLng.lng();
        marker.setPosition({ lat, lng });
        map.panTo({ lat, lng });
        emit('update:latitude', lat);
        emit('update:longitude', lng);
        fetchAddress(lat, lng);
    });

    marker.addListener('dragend', () => {
        const pos = marker.getPosition();
        const lat = pos.lat();
        const lng = pos.lng();
        emit('update:latitude', lat);
        emit('update:longitude', lng);
        fetchAddress(lat, lng);
    });
});

watch(
    () => [props.latitude, props.longitude],
    ([lat, lng]) => {
        if (marker && map) {
            const newPos = { lat, lng };
            marker.setPosition(newPos);
            map.setCenter(newPos);
            fetchAddress(lat, lng);
        }
    }
);
</script>