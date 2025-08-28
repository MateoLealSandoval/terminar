<script setup lang="ts">
import iconClose from '@/assets/imageIcons/admin_icons/icons8-close.webp'
import type { userPendingsDto } from '@/models/admin_panel/users_pendings';
import { onMounted, ref } from 'vue';
import axios from 'axios';

type FileData = {
    url: string;
    type: string;
};

const props = defineProps<{ data: userPendingsDto }>();
const emit = defineEmits<{
    (e: 'close'): void;
}>();

const imageBack = ref<FileData | null>(null);
const imageFront = ref<FileData | null>(null);

// Estado para el modal de zoom
const zoomVisible = ref(false);
const zoomImageSrc = ref<string | null>(null);
const zoomImageType = ref<string | null>(null);

const showZoom = (file: FileData) => {
    zoomImageSrc.value = file.url;
    zoomImageType.value = file.type;
    zoomVisible.value = true;
};

const closeZoom = () => {
    zoomVisible.value = false;
    zoomImageSrc.value = null;
    zoomImageType.value = null;
};

const getImages = async (file: string): Promise<FileData | null> => {
    try {
        const response = await axios.get(`/files-privates/view-private/${file}`, {
            responseType: 'blob',
        });
        const blob = response.data;
        const fileType = blob.type;
        const url = URL.createObjectURL(blob);
        return { url, type: fileType };
    } catch (error) {
        console.error('Error al cargar el archivo', error);
        return null;
    }
};

onMounted(async () => {
    imageBack.value = await getImages(props.data.side_back);
    imageFront.value = await getImages(props.data.side_front);
});
</script>

<template>
    <div class="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-6 shadow-lg transition-all w-[95%] h-[90%]">
            <div class="w-[98%] h-full flex flex-col">
                <!-- Cerrar -->
                <div class="w-full">
                    <img :src="iconClose" alt="close" class="ml-auto cursor-pointer" @click="emit('close')" />
                </div>

                <!-- Imagen frontal y trasera -->
                <div class="w-[98%] overflow-hidden flex mx-auto overflow-y-auto justify-between">
                    <div v-if="imageFront" class="w-[45%] cursor-zoom-in" @click="showZoom(imageFront)">
                        <img
                            v-if="imageFront.type.startsWith('image')"
                            :src="imageFront.url"
                            alt="frontal"
                            class="w-full h-auto"
                        />
                        <div v-else class="text-center p-4 bg-gray-200 rounded">📄 Archivo PDF</div>
                    </div>

                    <div v-if="imageBack" class="w-[45%] cursor-zoom-in" @click="showZoom(imageBack)">
                        <img
                            v-if="imageBack.type.startsWith('image')"
                            :src="imageBack.url"
                            alt="trasera"
                            class="w-full h-auto"
                        />
                        <div v-else class="text-center p-4 bg-gray-200 rounded">📄 Archivo PDF</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Modal de zoom -->
    <div v-if="zoomVisible" class="fixed inset-0 bg-black/80 z-[999] flex items-center justify-center"
        @click.self="closeZoom">
        <div class="relative w-[90%] h-[90%] bg-white rounded shadow-lg p-4">
            <img
                v-if="zoomImageType?.startsWith('image')&&zoomImageSrc"
                :src="zoomImageSrc"
                alt="zoom"
                class="max-w-full max-h-full mx-auto"
            />
            <iframe
                v-else
                v-if="zoomImageSrc"
                :src="zoomImageSrc"
                class="w-full h-full"
                frameborder="0"
            ></iframe>
            <img
                :src="iconClose"
                alt="close"
                @click="closeZoom"
                class="absolute top-3 right-3 w-6 h-6 cursor-pointer"
            />
        </div>
    </div>
</template>
