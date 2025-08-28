<script lang="ts" setup>
import { ref, computed, onMounted } from 'vue';
import { MyAcconutTypesModal } from './TypeModal_MyAccount';
import Modal_Date from './Diferents_Modals/Modal_Dates_rervations/Modal_Date.vue';
import Modal_Notifications from './Diferents_Modals/Modal_Notifications.vue';
import Modal_Specialists from './Diferents_Modals/Modal_Specialists.vue';
import { useAuthStore } from '@/store';
import Modal_userPerfil from './Modals_init_user/Modal_user.perfil.vue';
import Modal_favoritesPerfil from './Modals_init_user/Modal_favorites.perfil.vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { storeUserPanel } from '@/store/store_user_panel/panelsusers.store';


// Estado

const storeModalUser = storeUserPanel();
const selectModal = computed(() => storeModalUser.selectPanel || MyAcconutTypesModal.INIT);
const pendingsNotifications = computed(() => storeModalUser.notificationPengins || 0);
const showModal = ref(false);
function NavigateSpecialists() {
    storeModalUser.setPanel(MyAcconutTypesModal.SPECIALISTS)

}
// Métodos
function setModal(type: MyAcconutTypesModal) {
    storeModalUser.setPanel(type)

}

// const storeUser = useUserStore();
const storeAuth = useAuthStore();
const user = computed(() => storeAuth.user);
function closeVideoModal() {
    showModal.value = false;
    localStorage.setItem('hasSeenYoutubeVideo', 'true');
}
const showAlert = () => {
    Swal.fire({
        title: "¡Alerta!",
        text: "¿Estás seguro de cerrar sesión?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "var(--blue-1)",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si",
        cancelButtonText: "Cancelar"

    }).then((result) => {
        if (result.isConfirmed) {
            storeAuth.close_session();

        }
    });
};
// Ciclo de vida
onMounted(async () => {
    await storeModalUser.getNotificationsPendings()
    const hasSeenVideo = localStorage.getItem('hasSeenYoutubeVideo');
    if (!hasSeenVideo) {
        showModal.value = true;
    }
});
const router = useRouter()
function navigateToEsPecialists() {
    router.push('/specialists')
}
// Computed
const accountTypesModal = computed(() => MyAcconutTypesModal);
</script>
<template>

    <div class="w-full bg-white font-poppins">
        <div class="w-[90%] mx-auto  ">
            <div class="w-full flex justify-between mt-10">
                <h1>Mi cuenta</h1>
                <div @click="showAlert" class="cursor-pointer">
                    <h1 class="text-xs">Cerrar sesión</h1>
                </div>
            </div>
        </div>

        <h1 v-if="user?.names != null" class=" font-bold  text-3xl   w-[90%] mx-auto  ">{{ `¡Hola ${user.names}
            ${user.lastnames}!` }}</h1>
        <div class="w-full flex gap-5 justify-center items-center py-5">
            <div class="bg-[var(--blue-1)] rounded-xl text-white font-semibold cursor-pointer"
                @click="NavigateSpecialists">
                <p class="py-2 px-4 text-xs"> Buscar especialista</p>
            </div>
            <div class="bg-[var(--blue-1)] rounded-xl text-white font-semibold cursor-pointer"
                @click="NavigateSpecialists">
                <p class="py-2 px-4 text-xs">Agendar cita</p>
            </div>
        </div>
    </div>




    <div class="  w-[90%] m-auto  h-full font text-xs">
        <div class="w-full bg-white   overflow-hidden">
            <div class="w-[90%] m-auto  h-full  flex   justify-center  overflow-hidden items-end text-gray-500">
                <div class="w-[85%]" :class="{
                    ' text-[var(--blue-1)]': selectModal === MyAcconutTypesModal.INIT
                }">
                    <div class="flex w-full  justify-center sm:justify-start my-4 cursor-pointer items-center mx-auto"
                        @click="setModal(MyAcconutTypesModal.INIT)">
                        <div class="mx-auto flex gap-2 items-center">
                            <svg version="1.0" xmlns="http://www.w3.org/2000/svg" class="w-6 h-6   "
                                :class="{ 'text-[var(--blue-1)]': selectModal === MyAcconutTypesModal.INIT }"
                                :style="{ color: selectModal === MyAcconutTypesModal.INIT ? 'var(--blue-1)' : '#6a7282' }"
                                viewBox="0 0 180.000000 180.000000" preserveAspectRatio="xMidYMid meet">

                                <g transform="translate(0.000000,180.000000) scale(0.100000,-0.100000)"
                                    fill="currentColor" stroke="none">
                                    <path d="M815 1788 c-132 -18 -255 -113 -318 -245 -30 -64 -32 -75 -32 -178 0
-103 2 -114 32 -178 42 -89 121 -168 210 -209 55 -26 83 -33 154 -36 143 -7
243 32 338 133 157 166 153 432 -8 593 -101 101 -227 141 -376 120z m208 -121
c68 -31 134 -95 167 -162 34 -71 35 -198 1 -273 -32 -70 -123 -154 -193 -178
-162 -54 -333 17 -408 170 -57 116 -39 261 46 355 25 28 61 60 81 73 88 54
209 60 306 15z" />
                                    <path d="M474 920 c-140 -28 -241 -142 -288 -322 -23 -88 -39 -254 -32 -322
12 -120 85 -216 190 -253 46 -16 97 -18 561 -18 l510 0 68 33 c74 37 113 80
143 158 14 36 16 68 11 186 -7 197 -48 331 -133 434 -48 59 -140 104 -219 106
-56 2 -65 -1 -135 -45 -187 -117 -314 -116 -511 3 -84 51 -94 54 -165 40z
m130 -134 c206 -128 411 -123 612 15 38 26 51 30 82 24 153 -29 244 -204 246
-475 1 -88 -2 -111 -20 -145 -23 -45 -69 -80 -123 -95 -51 -14 -954 -13 -1006
1 -58 16 -104 55 -128 107 -17 41 -19 60 -14 162 13 253 87 398 227 441 42 13
50 10 124 -35z" />
                                </g>
                            </svg>
                            <h1 class=" hidden md:block text-xs">Mi perfil</h1>
                        </div>
                    </div>

                </div>

                <div class="w-[85%]" :class="{
                    ' text-[var(--blue-1)]': selectModal === MyAcconutTypesModal.MYDATES
                }">


                    <div class="flex w-full gap-4 justify-center sm:justify-start my-4 cursor-pointer items-center mx-auto"
                        @click="setModal(MyAcconutTypesModal.MYDATES)">
                        <div class="mx-auto flex gap-2 items-center">
                            <svg class="w-6 h-6 text-gray-500" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                :class="{ 'text-[var(--blue-1)]': selectModal === MyAcconutTypesModal.MYDATES }"
                                :style="{ color: selectModal === MyAcconutTypesModal.MYDATES ? 'var(--blue-1)' : '#6a7282' }"
                                fill="currentColor">
                                <path
                                    d="M438-226 296-368l58-58 84 84 168-168 58 58-226 226ZM200-80q-33 0-56.5-23.5T120-160v-560q0-33 23.5-56.5T200-800h40v-80h80v80h320v-80h80v80h40q33 0 56.5 23.5T840-720v560q0 33-23.5 56.5T760-80H200Zm0-80h560v-400H200v400Zm0-480h560v-80H200v80Zm0 0v-80 80Z" />
                            </svg>
                            <h1 class=" hidden md:block text-xs">Mis citas</h1>
                        </div>
                    </div>

                </div>
                <div class="w-[85%]" :class="{
                    ' text-[var(--blue-1)]': selectModal === MyAcconutTypesModal.FAVORITES_USER
                }">

                    <div class="flex w-full gap-4 justify-center sm:justify-start my-4 cursor-pointer items-center mx-auto"
                        @click="setModal(MyAcconutTypesModal.FAVORITES_USER)">
                        <div class="mx-auto flex gap-2 items-center">
                            <svg class="w-6 h-6 text-gray-500"
                                :class="{ 'text-[var(--blue-1)]': selectModal === MyAcconutTypesModal.FAVORITES_USER }"
                                :style="{ color: selectModal === MyAcconutTypesModal.FAVORITES_USER ? 'var(--blue-1)' : '#6a7282' }"
                                viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                    d="M12 6.00019C10.2006 3.90317 7.19377 3.2551 4.93923 5.17534C2.68468 7.09558 2.36727 10.3061 4.13778 12.5772C5.60984 14.4654 10.0648 18.4479 11.5249 19.7369C11.6882 19.8811 11.7699 19.9532 11.8652 19.9815C11.9483 20.0062 12.0393 20.0062 12.1225 19.9815C12.2178 19.9532 12.2994 19.8811 12.4628 19.7369C13.9229 18.4479 18.3778 14.4654 19.8499 12.5772C21.6204 10.3061 21.3417 7.07538 19.0484 5.17534C16.7551 3.2753 13.7994 3.90317 12 6.00019Z"
                                    stroke="currentColor" stroke-width="2" stroke-linecap="round"
                                    stroke-linejoin="round" />
                            </svg>

                            <h1 class=" hidden md:block text-xs">Mis favoritos</h1>


                        </div>

                    </div>
                </div>
                <div class="w-full" :class="{
                    ' text-[var(--blue-1)]': selectModal === MyAcconutTypesModal.SPECIALISTS
                }">
                    <div class="flex w-full gap-4 justify-center sm:justify-start my-4 cursor-pointer items-center mx-auto"
                        @click="setModal(MyAcconutTypesModal.SPECIALISTS)">
                        <div class="mx-auto flex gap-2 items-center">
                            <svg class="w-6 h-6 text-gray-500" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 -960 960 960"
                                :class="{ 'text-[var(--blue-1)]': selectModal === MyAcconutTypesModal.SPECIALISTS }"
                                :style="{ color: selectModal === MyAcconutTypesModal.SPECIALISTS ? 'var(--blue-1)' : '#6a7282' }"
                                fill="currentColor">
                                <path
                                    d="M784-120 532-372q-30 24-69 38t-83 14q-109 0-184.5-75.5T120-580q0-109 75.5-184.5T380-840q109 0 184.5 75.5T640-580q0 44-14 83t-38 69l252 252-56 56ZM380-400q75 0 127.5-52.5T560-580q0-75-52.5-127.5T380-760q-75 0-127.5 52.5T200-580q0 75 52.5 127.5T380-400Z" />
                            </svg>
                            <h1 class=" hidden md:block text-xs">Especialistas</h1>
                        </div>
                    </div>
                </div>

                <div class="w-full" :class="{
                    ' text-[var(--blue-1)]': selectModal === MyAcconutTypesModal.NOTIFICATIONS
                }">

                    <div class="flex w-full gap-4 justify-center sm:justify-start my-4 cursor-pointer items-center mx-auto"
                        @click="setModal(MyAcconutTypesModal.NOTIFICATIONS)">
                        <div class="mx-auto flex gap-2 items-center">
                            <h1>({{ pendingsNotifications }})</h1>
                            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                :class="{ 'text-[var(--blue-1)]': selectModal === MyAcconutTypesModal.NOTIFICATIONS }"
                                :style="{ color: selectModal === MyAcconutTypesModal.NOTIFICATIONS ? 'var(--blue-1)' : '#6a7282' }"
                                class="w-6 h-6 text-gray-500" viewBox="0 0 180.000000 180.000000"
                                preserveAspectRatio="xMidYMid meet">

                                <g transform="translate(0.000000,180.000000) scale(0.100000,-0.100000)"
                                    fill="currentColor" stroke="none">
                                    <path d="M756 1665 c-182 -50 -330 -194 -393 -382 -12 -38 -17 -106 -20 -320
l-5 -273 -69 -102 c-81 -121 -88 -156 -40 -210 l29 -33 185 -3 184 -3 13 -40
c19 -56 85 -128 145 -155 69 -33 161 -33 230 0 60 27 126 99 145 155 l13 40
184 3 185 3 29 33 c48 54 41 89 -40 210 l-69 102 -5 273 c-3 214 -8 282 -20
320 -64 191 -212 333 -397 382 -68 18 -218 18 -284 0z m236 -96 c134 -28 262
-131 322 -259 l31 -65 5 -285 c4 -157 10 -294 15 -305 5 -11 35 -59 67 -107
32 -48 58 -90 58 -93 0 -7 -1180 -7 -1180 0 0 3 26 45 58 93 32 48 62 96 67
107 5 11 11 148 15 305 l5 285 31 65 c91 193 303 302 506 259z m68 -1240 c0
-7 -19 -31 -43 -54 -73 -74 -161 -74 -234 0 -24 23 -43 47 -43 54 0 8 48 11
160 11 112 0 160 -3 160 -11z" />
                                </g>
                            </svg>
                            <h1 class=" hidden md:block text-xs">Notificaciones</h1>
                        </div>
                    </div>
                </div>
                <div class="w-full" :class="{
                    ' text-[var(--blue-1)]': selectModal === MyAcconutTypesModal.FIDELITY
                }">

                    <div class="flex w-full gap-4 justify-center sm:justify-start my-4 cursor-pointer items-center mx-auto"
                        @click="setModal(MyAcconutTypesModal.FIDELITY)">
                        <div class="mx-auto flex gap-2 items-center">
                            <svg version="1.0" xmlns="http://www.w3.org/2000/svg"
                                :class="{ 'text-[var(--blue-1)]': selectModal === MyAcconutTypesModal.FIDELITY }"
                                :style="{ color: selectModal === MyAcconutTypesModal.FIDELITY ? 'var(--blue-1)' : '#6a7282' }"
                                class="w-6 h-6 text-gray-500" viewBox="0 0 180.000000 180.000000"
                                preserveAspectRatio="xMidYMid meet">

                                <g transform="translate(0.000000,180.000000) scale(0.100000,-0.100000)"
                                    fill="CurrentColor" stroke="none">
                                    <path d="M870 1765 c-6 -8 -9 -23 -6 -33 5 -16 22 -21 104 -30 202 -23 345
-89 486 -221 146 -139 231 -319 251 -533 5 -64 10 -78 26 -83 48 -15 62 50 38
181 -57 327 -287 592 -599 692 -130 42 -276 55 -300 27z" />
                                    <path d="M805 1549 c-147 -22 -258 -80 -371 -193 -129 -129 -187 -271 -187
-456 0 -188 58 -328 192 -460 137 -135 275 -193 461 -193 186 0 324 58 461
193 134 132 192 272 192 460 0 188 -58 328 -192 460 -127 125 -248 181 -422
193 -41 3 -101 1 -134 -4z m239 -89 c43 -11 101 -32 129 -47 78 -41 206 -174
245 -254 82 -169 82 -349 0 -518 -39 -80 -167 -213 -245 -254 -70 -37 -192
-67 -273 -67 -81 0 -203 30 -273 67 -78 41 -206 174 -245 254 -82 169 -82 349
0 518 39 80 167 213 245 254 121 64 280 82 417 47z" />
                                    <path d="M873 1288 c-6 -7 -32 -56 -58 -108 -26 -52 -49 -97 -50 -98 -2 -2
-55 -12 -117 -21 -63 -10 -120 -21 -126 -25 -30 -18 -11 -52 74 -131 l87 -81
-21 -117 c-12 -65 -19 -124 -16 -132 11 -29 38 -23 145 31 l111 55 108 -56
c105 -53 133 -59 144 -30 3 8 -4 67 -16 132 l-21 117 87 81 c85 79 104 113 74
131 -6 4 -64 15 -127 25 -64 10 -117 21 -119 26 -1 4 -26 53 -55 108 -53 101
-79 124 -104 93z m72 -197 c42 -87 40 -86 148 -97 37 -4 67 -11 67 -16 0 -5
-28 -35 -62 -67 l-62 -58 16 -91 c9 -57 11 -92 5 -92 -6 0 -38 16 -73 35 -34
19 -71 35 -83 35 -11 0 -49 -16 -84 -35 -35 -19 -68 -35 -74 -35 -6 0 -4 34 5
92 l16 91 -62 58 c-34 32 -62 62 -62 67 0 5 30 12 68 16 107 11 105 10 147 97
22 43 42 79 45 79 3 0 23 -36 45 -79z" />
                                    <path d="M30 925 c-9 -11 -11 -38 -7 -98 30 -397 331 -726 731 -796 130 -23
196 -10 182 37 -5 16 -22 21 -104 30 -212 24 -375 103 -514 249 -133 140 -201
297 -224 513 -3 36 -11 68 -18 72 -17 12 -32 9 -46 -7z" />
                                </g>
                            </svg>

                            <h1 class=" hidden md:block text-xs">Plan de fidelización</h1>
                        </div>
                    </div>
                </div>
                <div class="w-[85%]" :class="{
                    ' text-[var(--blue-1)]': selectModal === MyAcconutTypesModal.HELP
                }">

                    <div class="flex w-full gap-4 justify-center sm:justify-start my-4 cursor-pointer items-center mx-auto"
                        @click="setModal(MyAcconutTypesModal.HELP)">
                        <div class="mx-auto flex gap-2 items-center">
                            <svg class="w-6 h-6 text-gray-500"
                                :class="{ 'text-[var(--blue-1)]': selectModal === MyAcconutTypesModal.HELP }"
                                :style="{ color: selectModal === MyAcconutTypesModal.HELP ? 'var(--blue-1)' : '#6a7282' }"
                                fill="currentColor" version="1.0" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 180.000000 180.000000" preserveAspectRatio="xMidYMid meet">

                                <g transform="translate(0.000000,180.000000) scale(0.100000,-0.100000)" stroke="none">
                                    <path d="M604 1790 c-133 -18 -235 -61 -343 -145 -244 -191 -324 -537 -191
-822 l28 -62 -43 -158 c-24 -87 -42 -160 -39 -162 2 -2 71 14 154 37 168 47
172 48 203 28 34 -23 166 -64 228 -71 l56 -7 23 -56 c70 -171 216 -302 390
-347 97 -26 227 -23 320 8 41 14 89 31 105 37 26 11 46 8 160 -23 71 -20 130
-35 132 -33 1 1 -14 61 -34 134 l-36 131 26 63 c39 95 50 144 50 238 0 166
-52 290 -173 410 -69 69 -150 119 -231 144 -12 3 -19 22 -24 65 -17 146 -102
309 -215 415 -144 133 -356 201 -546 176z m201 -105 c217 -46 395 -217 451
-436 22 -86 15 -241 -15 -323 -66 -187 -223 -333 -407 -380 -78 -20 -212 -21
-289 -1 -33 8 -90 31 -127 50 l-67 34 -88 -24 c-104 -29 -117 -30 -109 -10 3
9 15 53 27 98 l22 83 -37 75 c-97 197 -83 409 39 589 135 198 368 294 600 245z
m681 -706 c62 -42 134 -126 165 -194 64 -135 61 -282 -6 -420 l-34 -70 19 -69
c11 -38 18 -71 17 -73 -2 -1 -35 6 -74 17 l-71 20 -64 -34 c-180 -94 -399 -62
-547 79 -65 61 -143 192 -119 199 7 1 45 10 83 20 138 32 268 114 362 227 55
67 118 195 133 274 18 91 14 86 57 69 21 -9 56 -29 79 -45z" />
                                    <path d="M616 1466 c-49 -18 -94 -60 -117 -111 -31 -66 -27 -75 31 -75 39 0
50 3 50 16 0 9 15 31 34 50 27 27 42 34 74 34 48 0 86 -28 102 -74 17 -53 4
-80 -76 -156 l-74 -70 0 -60 0 -60 50 0 50 0 0 36 c0 32 10 47 69 110 76 80
87 107 79 195 -12 126 -150 210 -272 165z" />
                                    <path d="M640 795 l0 -45 50 0 50 0 0 45 0 45 -50 0 -50 0 0 -45z" />
                                </g>
                            </svg>


                            <h1 class=" hidden md:block text-xs">Ayudas</h1>
                        </div>
                    </div>
                </div>

            </div>
            <hr class="text-gray-300 w-full " />
        </div>
        <div class="w-full md:w-full  bg-white overflow-hidden">
            <Modal_userPerfil v-if="selectModal === MyAcconutTypesModal.INIT"
                :opensearch="() => setModal(MyAcconutTypesModal.SPECIALISTS)" />
            <Modal_Date v-if="selectModal === MyAcconutTypesModal.MYDATES"
                :opensearch="() => setModal(MyAcconutTypesModal.SPECIALISTS)" />
            <Modal_favoritesPerfil v-if="selectModal === MyAcconutTypesModal.FAVORITES_USER" />
            <Modal_Notifications v-if="selectModal === MyAcconutTypesModal.NOTIFICATIONS" />
            <Modal_Specialists v-if="selectModal === MyAcconutTypesModal.SPECIALISTS" />
        </div>




    </div>


</template>