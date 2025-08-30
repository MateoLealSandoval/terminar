<script setup lang="ts">
import EpaycoComponent from '@/components/EpaycoComponent.vue';
const goToTerms = () => {
    window.open('/terms', '_blank');
};
</script>

<template>
    <div class="w-screen bg-gradient-to-r from-gray-100 to-gray-50 font-poppins text-xs lg:text-base">
        <div class="container m-auto max-w-[90%]">
            <div class="text-center py-18">
                <h1 class="text-[var(--blue-1)] text-xl">Soluciones que transforman tu marca</h1>
                <h1 class="font-bold text-xl">Estamos aquí para ayudarte con tu marca personal</h1>
            </div>
        </div>
        
        <div class="container m-auto flex flex-wrap font-poppins justify-between px-8 pb-10">

            <!-- PLAN STARTER -->
            <div class="w-full md:w-[30%]">
                <hr class="w-[80%] mx-auto border-t-8 border-[var(--blue-1)]" />
                <div class="w-full border rounded-2xl text-center flex flex-col h-full">
                    <div class="w-[90%] mx-auto flex-grow">
                        <h1 class="mt-10 text-xl lg:text-3xl font-bold text-[var(--blue-1)]">Starter</h1>
                        <h2 class="text-3xl lg:text-5xl font-bold text-gray-600">$ 2.385.000</h2>
                        <p class="text-gray-400">mensuales (IVA incluido)</p>
                        
                        <div class="mb-2">
                            <h1 class="my-3 text-[14px]">8 piezas gráficas personalizadas - (Versión Post e Historias), alineadas con la identidad de marca (Colores, tipografía y estilo).</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">2 Videos promocionales de hasta 30 segundos de duración (Incluyen Edición, Audio, texto)</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">2 Infografías claras e interactivas - Ejemplo: mitos y verdades</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">1 video promocionales o Reels de hasta 20 seg de duración.</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Manejo de todas sociales completo (Instagram + TikTok o Facebook o LinkedIn)</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Cronograma de publicación optimizado de los 3 pilares para contenido gráfico y audiovisual en las 2 a 3 plataformas seleccionadas</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Apoyo en tus procesos de apoyo gratuito con acompañamiento en las 3 a 4 actividades</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                    </div>
                    
                    <div class="w-[80%] mx-auto rounded-xl mb-5">
                        <EpaycoComponent amount="2385000" name="Plan STARTER" description="Plan STARTER" />
                    </div>
                </div>
            </div>

            <!-- PLAN PLUS -->
            <div class="w-full md:w-[30%] mb-2 min-h-[70vh]">
                <hr class="w-[80%] mx-auto border-t-8 border-amber-500" />
                <div class="w-full border rounded-2xl text-center flex flex-col h-full">
                    <div class="w-[90%] mx-auto flex-grow">
                        <h1 class="mt-10 text-xl lg:text-3xl font-bold text-amber-500">Plus</h1>
                        <h2 class="text-3xl lg:text-5xl font-bold text-gray-600">$ 3.115.000</h2>
                        <p class="text-gray-400">mensuales (IVA incluido)</p>
                        
                        <div class="mb-2">
                            <h1 class="my-3 text-[14px]">11 piezas gráficas personalizadas - (Versión Post e Historia). Coherentes con la identidad de marca (Colores, tipografía y estilo)</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">3 Videos promocionales o Reels de hasta 20 seg de duración.</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Manejo de redes sociales optimizado (Instagram completo + tiktok + optimización de redes opcionales)</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Pauta de crecimiento para contenido gráfico y audiovisual en las 3 a 4 plataformas seleccionadas</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Manejo de todas las redes sociales completo (Instagram + LinkedIn + Facebook o TikTok)</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                    </div>
                    
                    <div class="w-[80%] mx-auto rounded-xl mb-5">
                        <EpaycoComponent amount="3115000" name="Plan PLUS" description="Plan PLUS" />
                    </div>
                </div>
            </div>

            <!-- PLAN VIP -->
            <div class="w-full md:w-[30%] mb-2 min-h-[70vh]">
                <hr class="w-[80%] mx-auto border-t-8 border-green-500" />
                <div class="w-full border rounded-2xl text-center flex flex-col h-full">
                    <div class="w-[90%] mx-auto flex-grow">
                        <h1 class="mt-10 text-xl lg:text-3xl font-bold text-green-500">VIP</h1>
                        <h2 class="text-3xl lg:text-5xl font-bold text-gray-600">$ 3.945.000</h2>
                        <p class="text-gray-400">mensuales (IVA incluido)</p>
                        
                        <div class="mb-2">
                            <h1 class="my-3 text-[14px]">12 piezas gráficas personalizadas - (Versión Post e Historias). Coherente con la identidad de marca (Colores, tipografía y estilo)</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">2 Videos promocionales o Reels de hasta 20 seg de duración</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Promoción de videos con historias gráficas y reels</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Manejo de todas las redes sociales completo (optimización de redes opcionales)</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Pauta de crecimiento para contenido gráfico y audiovisual en las 4 a 5 plataformas seleccionadas</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">1 Diseño de una landing page con el objetivo de capturar lead en campañas</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                    </div>
                    
                    <div class="w-[80%] mx-auto rounded-xl mb-5">
                        <EpaycoComponent amount="3945000" name="Plan VIP" description="Plan VIP" />
                    </div>
                </div>
            </div>

        </div>
        
        <!-- SECCIÓN PERSONALIZADO -->
        <div class="w-[90%] mx-auto pb-12">
            <h1 class="mt-10 text-2xl lg:text-3xl font-bold text-[var(--blue-1)] text-center">Personalizado</h1>
            
            <div class="w-full text-center mt-4 space-y-2">
                <p class="text-gray-700">
                    Si alguno de los paquetes no es lo que estás buscando y necesitas algo más personalizado,
                </p>
                <p class="text-gray-700">
                    CONTÁCTANOS al
                    <span>
                        <a href="https://wa.me/573124967421" target="_blank" rel="noopener noreferrer"
                            class="text-[var(--blue-1)] hover:underline font-semibold">
                            312 4967421
                        </a>
                    </span>
                    y una persona del equipo se pondrá en contacto contigo para
                </p>
                <p class="text-gray-700">
                    poder orientarte y ofrecerte una solución a la medida.
                </p>
            </div>
            
            <div class="mt-8 text-center">
                <p class="text-[var(--blue-1)] text-sm font-medium">
                    Consulta las condiciones de los planes DOCVISUAL.
                </p>
                <p class="text-[var(--blue-1)] text-sm font-medium mt-1">
                    Contrato mínimo 3 meses para lograr resultados.
                </p>
            </div>
            
            <!-- Logo ICÓNICA Partner -->
            <div class="w-full flex justify-center mt-10">
                <div class="flex items-center space-x-3">
                    <span class="text-gray-600 font-medium text-lg">Partner</span>
                    <img class="h-12 w-auto object-contain" src="@/assets/images/IconicaPartner.webp" alt="ICÓNICA" />
                </div>
            </div>
        </div>
    </div>
</template>