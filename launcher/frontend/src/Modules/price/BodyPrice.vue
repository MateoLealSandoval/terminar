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
                <h1 class="text-[var(--blue-1)]">Elige el plan ideal para lograr tus objetivos</h1>
                <h1 class="font-bold text-xl">Recuerda que para crear tu cuenta profesional, debes adquirir tu plan.</h1>
            </div>
        </div>
        
        <div class="container m-auto flex flex-wrap font-poppins justify-between px-8 pb-10">

            <!-- PLAN BÁSICO -->
            <div class="w-full md:w-[30%]">
                <hr class="w-[80%] mx-auto border-t-8 border-[var(--blue-1)]" />
                <div class="w-full border rounded-2xl text-center flex flex-col h-full">
                    <div class="w-[90%] mx-auto flex-grow">
                        <h1 class="mt-10 text-xl lg:text-3xl font-bold text-[var(--blue-1)]">Básico</h1>
                        <h2 class="text-3xl lg:text-5xl font-bold text-gray-600">178.500 COP</h2>
                        <p class="text-gray-400">mensuales (IVA incluido)</p>
                        
                        <div class="mb-2">
                            <h1 class="my-3 text-[14px]">Gana visibilidad con reservas online y recordatorios</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>

                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Perfil general con especialidad, servicios, productos y campos de acción.</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Consulta de ubicación; horarios.</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Agendamiento de cita y consultas generales.</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Búsqueda sencilla SEO local (Ubicación, especialidad, precios)</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Recordatorios automáticos.</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Perfil para consultar (Notificaciones, valoraciones por parte de pacientes, agenda).</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Campañas en Google Ads. Soporte técnico.</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                    </div>
                    
                    <div class="w-[80%] mx-auto rounded-xl mb-5">
                        <EpaycoComponent 
                            amount="178500" 
                            name="Plan BÁSICO" 
                            description="Plan BÁSICO"
                            planType="BASIC" />
                    </div>
                </div>
            </div>

            <!-- PLAN ESTÁNDAR -->
            <div class="w-full md:w-[30%] mb-2 min-h-[70vh]">
                <hr class="w-[80%] mx-auto border-t-8 border-amber-500" />
                <div class="w-full border rounded-2xl text-center flex flex-col h-full">
                    <div class="w-[90%] mx-auto flex-grow">
                        <h1 class="mt-10 text-xl lg:text-3xl font-bold text-amber-500">Estándar</h1>
                        <h2 class="text-3xl lg:text-5xl font-bold text-gray-600">214.200 COP</h2>
                        <p class="text-gray-400">mensuales (IVA incluido)</p>
                        
                        <div class="mb-2">
                            <h1 class="my-3 text-[14px]">Ofrece una excelente experiencia al paciente y crea clientes fidelizados</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>

                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Todo lo que incluye el plan BÁSICO más:</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Conexión a las Redes Sociales y a la página web.</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Sincronización con el calendario de consultas.</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Recordatorios automáticos avanzados.</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Panel de analíticas.</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Campañas de Email marketing básicas.</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                    </div>
                    
                    <div class="w-[80%] mx-auto rounded-xl mb-5">
                        <EpaycoComponent 
                            amount="214200" 
                            name="Plan ESTÁNDAR" 
                            description="Plan ESTÁNDAR"
                            planType="STANDARD" />
                    </div>
                </div>
            </div>

            <!-- PLAN PREMIUM -->
            <div class="w-full md:w-[30%] mb-2 min-h-[70vh]">
                <hr class="w-[80%] mx-auto border-t-8 border-green-500" />
                <div class="w-full border rounded-2xl text-center flex flex-col h-full">
                    <div class="w-[90%] mx-auto flex-grow">
                        <h1 class="mt-10 text-xl lg:text-3xl font-bold text-green-500">Premium</h1>
                        <h2 class="text-3xl lg:text-5xl font-bold text-gray-600">297.500 COP</h2>
                        <p class="text-gray-400">mensuales (IVA incluido)</p>
                        
                        <div class="mb-2">
                            <h1 class="my-3 text-[14px]">Todo lo que incluye el plan ESTÁNDAR más: Participación en Block Doc Visual / Videos de consulta de cuidado primario.</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>

                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Envíos masivos bidireccionales de nueva cita y/o producto.</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Publicidad en el sitio y espacios especiales.</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">1 Capacitación en Marca personal.</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">2 Capacitaciones en Marketing Digital.</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">1 Creación de una landing page básica (No incluye Hosting y Dominio).</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                        
                        <div class="mb-2 text-[14px]">
                            <h1 class="my-3">Apertura y/o actualización de Google Business.</h1>
                            <hr class="w-[70%] mx-auto border-t-2 border-[var(--blue-1)] mb-3" />
                        </div>
                    </div>
                    
                    <div class="w-[80%] mx-auto rounded-xl mb-5">
                        <EpaycoComponent 
                            amount="297500" 
                            name="Plan PREMIUM" 
                            description="Plan PREMIUM"
                            planType="PREMIUM" />
                    </div>
                </div>
            </div>

        </div>

        <!-- logo Iconica…..Partner -->
        <div class="w-full flex flex-wrap justify-center">
            <img class="w-[21%] h-auto object-contain" src="@/assets/images/IconicaPartner.webp" />
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