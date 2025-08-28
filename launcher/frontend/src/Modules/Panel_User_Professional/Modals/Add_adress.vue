<script lang="ts">
import { usePofessionalStorage } from "@/store";
import { onMounted, ref } from "vue";
import MapLeafetSelect from "./MapLeafetSelect.vue";
import type { add_office_professional_dto } from "@/dto/professional/office_professional";
import { toast } from "vue3-toastify";

export default {
    name: 'add_adress',
    components: {
        MapLeafetSelect
    },
    setup(_, { emit }) {

        const store_professional = usePofessionalStorage()
        const latitude = ref(4.7110);
        const longitude = ref(-74.0721);
        const address = ref("");
        const local = ref("");
        const departament = ref("");
        const city = ref("");
        const moveToNewLocation = () => {
            latitude.value = 5.0;
            longitude.value = -73.0;
        };
        const closeModal = () => {
            emit("close"); // Emitir el evento para que el padre cierre el modal
        };
        const add_office = async () => {
            try {
                if (latitude && longitude && address.value != '' && local.value != '') {
                    const send_data: add_office_professional_dto = {
                        description: address.value,
                        latitude: latitude.value,
                        longitude: longitude.value,
                        title: local.value,
                        departament:departament.value,
                        nameCity:city.value
                    }
                    await store_professional.add_office_professional(send_data)
                    toast.success("Consultorio creado exitosamente", {
                        position: 'top-center'
                    });
                    closeModal()
                } else {
                    toast.error("Faltan datos para crear un consultorio nuevo", {
                        position: 'top-center'
                    });
                }
            } catch (error) {
                toast.error("Error al crear un nuevo consultorio", {
                    position: 'top-center'
                });
            }
        }
        onMounted(() => {
            if (navigator.geolocation) {

                navigator.geolocation.getCurrentPosition(
                    (position) => {
                       
                        latitude.value = position.coords.latitude;
                        longitude.value = position.coords.longitude;
                    },
                    (error) => {
                        console.warn("❌ Error al obtener ubicación:", error);
                    },
                    { enableHighAccuracy: true }
                );
            } else {
                console.warn("❌ Geolocalización no soportada por el navegador.");
            }
        });
        const searchByAddress = async () => {
            const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

            if (!address.value) {
                toast.error("Por favor ingresa una dirección.",{
                        position:'top-center'
                    });
                return;
            }

            const url = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address.value)}&key=AIzaSyC8nT7qj-zeSinnptAAHaqDrqnxitAOPAU`;

            try {
                const response = await fetch(url);
                const data = await response.json();

                if (data.status === "OK" && data.results.length > 0) {
                    const result = data.results[0];
                    const location = result.geometry.location;

                    latitude.value = location.lat;
                    longitude.value = location.lng;

                    // ✅ Definimos el tipo explícito
                    type AddressComponent = {
                        long_name: string;
                        short_name: string;
                        types: string[];
                    };

                    const components = result.address_components as AddressComponent[];

                    const dept = components.find((comp: AddressComponent) =>
                        comp.types.includes("administrative_area_level_1")
                    );
                    const cityVal = components.find((comp: AddressComponent) =>
                        comp.types.includes("locality") || comp.types.includes("administrative_area_level_2")
                    );

                    departament.value = dept ? dept.long_name : "";
                    city.value = cityVal ? cityVal.long_name : "";

                    toast.success("Dirección encontrada y coordenadas actualizadas.", {
                        position: 'top-center'
                    });
                } else {
                    toast.error("No se pudo encontrar la dirección.", {
                        position: 'top-center'
                    });
                }
            } catch (err) {
                console.error("Error buscando la dirección:", err);
                toast.error("Ocurrió un error al buscar la dirección.", {
                    position: 'top-center'
                });
            }
        };






        return { latitude, longitude, address, local, moveToNewLocation, closeModal, add_office, departament, city, searchByAddress };


    }

}


</script>

<template>
    <div class="w-full font-poppins overflow-auto h-full flex flex-col">
        <MapLeafetSelect v-model:latitude="latitude" v-model:longitude="longitude" v-model:address="address"
            v-model:departament="departament" v-model:city="city" />

        <div class="w-full my-3">
            <p class="font-medium">Consultorio</p>
            <input type="text" v-model="local"
                class="block w-full px-4 py-2 mt-2 mb-3 text-gray-700 bg-white border border-gray-200 rounded-md      focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40   focus:outline-none focus:ring" />
            <p class="font-medium">Dirección:</p>
            <div class="flex mb-3">
                <input type="text" v-model="address"
                    class="block w-[70%] px-4 py-2   text-gray-700 bg-white border border-gray-200 rounded-md      focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40   focus:outline-none focus:ring" />
                <div class="w-[20%] ml-auto bg-[var(--blue-1)] py-2 rounded-xl cursor-pointer">
                    <h1 class="font-bold w-full text-center text-white" @click="searchByAddress">Buscar</h1>
                </div>
            </div>


            <div class="flex">
                <div class="w-1/2">
                    <div class="w-[90%] mr-auto">
                        <p class="font-medium">Departamento:</p>
                        <input type="text" v-model="departament" readonly
                            class="block w-full px-4 py-2   text-gray-700 bg-white border border-gray-200 rounded-md      focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40   focus:outline-none focus:ring" />
                    </div>
                </div>
                <div class="w-1/2">
                    <div class="w-[90%] ml-auto">
                        <p class="font-medium">Ciudad:</p>
                        <input type="text" v-model="city" readonly
                            class="block w-full px-4 py-2   text-gray-700 bg-white border border-gray-200 rounded-md      focus:border-blue-400 focus:ring-blue-300 focus:ring-opacity-40   focus:outline-none focus:ring" />
                    </div>
                </div>

            </div>

        </div>
        <div class="w-full flex gap-x-4 mt-auto">
            <div class="w-1/2">
                <button class="w-full p-6 bg-[var(--blue-1)] text-white py-2  rounded-3xl cursor-pointer"
                    @click="add_office">
                    Crear consultorio
                </button>
            </div>
            <div class="w-1/2">
                <button @click="closeModal" class="w-full border p-6 border-red-200 py-2 rounded-3xl">
                    Cancelar
                </button>
            </div>
        </div>

        <!-- <button @click="moveToNewLocation">Mover a Nueva Ubicación</button> -->
    </div>
</template>