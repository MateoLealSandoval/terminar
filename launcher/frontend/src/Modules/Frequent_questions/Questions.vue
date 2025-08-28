<script lang="ts">
import Question from "./Question.vue";

export default {
    name: "questions",
    components: {
        Question,
    },
    data() {
        return {
            q1: false,
            q2: false,
            q3: false,
            q4: false,
            q5: false,
            q6: false,
            q7: false,
            q8: false,
            q9: false,
            open: false, // Controla si las preguntas están visibles
        };
    },
    methods: {
        setOpen() {
            this.open = !this.open; // Alterna el estado de "open"
        },
        toggleQuestion(questionName: string) {
            // Recorre las claves de $data, pero excluye "open"
            Object.keys(this.$data).forEach((key) => {
                if (key === "open") return; // Ignorar la propiedad "open"

                const dataKey = key as keyof typeof this.$data;
                if (dataKey === questionName) {
                    this.$data[dataKey] = !this.$data[dataKey];
                } else {
                    this.$data[dataKey] = false;
                }
            });
        },
    },
};
</script>

<template>
    <div class="w-screen      pt-20">
        <h1 class="text-center font-poppins text-2xl font-semibold" style="color: var(--blue-1);">Soluciones que
            transforman</h1>
        <h2 class="text-center font-poppins text-2xl font-bold">Estamos aquí para ayudarte con tu bienestar visual</h2>
        <div class="container  m-auto  py-12">
            <!-- <div class="w-full md:w-1/3  md:flex md:justify-center  md:m-auto">
                <img src="@/assets/images/wommancircle.png" alt="photo" class="w-full" />
            </div> -->
            <div class=" w-full     px-6   ">

                <Question :state="q1" :text="'Está relacionada directamente con la edad del paciente:'"
                    :additionalInfo="['Niños entre 2 y 5 años deben visitar el oftalmólogo en edad temprana para una revisión general que certifique el buen estado de su visión.', 'A partir de los 15 años, en plena adolescencia, lo recomendable es asistir al oftalmólogo al menos una vez al año.', 'Durante la edad adulta y la vejez es importante atender la salud visual de forma periódica.']"
                    :question="'¿Cada cuánto tiempo debo visitar el optómetra?'"
                    @toggleState="toggleQuestion('q1')" />
                <Question :state="q2" @toggleState="toggleQuestion('q2')"
                    :additionalInfo="['Blefaritis: Este problema visual provoca enrojecimiento, hinchazón, ardor en los párpados y está relacionada con el ojo seco. Ocurre por el exceso de bacterias y grasa que se acumulan en los bordes del párpado y deben limpiarse con ayuda de tratamientos higiénicos.Usualmente se presenta con mayor frecuencia en personas que producen exceso de grasa y padecen de enfermedades de la piel (dermatitis).', 'Conjuntivitis:   Se trata de una afección común que sufren niños y adultos.Surge tras inflamarse la conjuntiva, el tejido fino que protege el interior del párpado y el blanco de los ojos.Cuando se presenta, el ojo aparece rosado porque los vasos sanguíneos están dilatados. Es importante destacar que se contagia, por lo que requiere tratamiento oportuno.', 'Cataratas:    Esta enfermedad puede atacar uno o dos ojos. Nubla la visión porque afecta al cristalino, también conocido como la lente del ojo.Existen tres tipos de cataratas: cortical, nuclear y subcapsular. Aunque en sus comienzos la opacidad es pequeña puede aumentar con el tiempo.En la mayoría de los casos esta afección se relaciona con el envejecimiento. Si crees tener cataratas debes acudir al oftalmólogo.', 'Miopía:    Se puede detectar cuando los objetos cercanos son fáciles de apreciar, pero los que se encuentran a una distancia lejana se ven borrosos.Esta enfermedad puede afectar tanto a niños como adultos. Siendo diagnosticada con frecuencia en los más a jóvenes entre los 8 y 12 años de edad. Quienes posean padres con esta afección es posible que puedan llegar a padecerla.', 'Astigmatismo:   Se caracteriza porque la forma de la córnea no es totalmente redonda. Entonces la luz entra en el ojo, pero se enfoca en varios puntos de la retina, situación que ocasiona visión distorsionada y borrosa. Su principal síntoma es la captación borrosa o distorsionada de objetos tanto lejanos como cercanos.Esta afección normalmente se desarrolla durante la niñez. Puede tratarse con lentes correctoras y con cirugía.', 'Hipermetropía:    En este caso los objetos que se encuentra lejos pueden ser bien vistos, mientras los que están cerca se ven borrosos.', 'Ojo seco:  Ocurre cuando la superficie del ojo no está bien lubricada ni humectada.Implica consecuencias negativas para la calidad visual de las personas y molestias como: sensación de arenilla, escozor, ardor e irritación. Padecer de ojo seco es bastante común y figura como una de las principales causas de consultas oftalmológicas.',]"
                    :text="''" :question="'¿Cuáles son las afecciones más comunes de la vista?'" />
                <Question :state="q3"
                    :text="'El ojo humano es un órgano sensible a la genética, responde a los cuidados a lo largo de la vida y puede sufrir de enfermedades vinculadas con la vejez.Así pues, es válido afirmar que existe un gran número de personas propensas a sufrir enfermedades oculares.Aunque no manifiesten una afección visual hereditaria, en algún momento de su vida son propensos a sufrir de problemas oculares.'"
                    :question="'¿Quién corre el riesgo de sufrir problemas de la vista?'"
                    @toggleState="toggleQuestion('q3')" />
                <transition name="fade">
                    <Question :state="q4" v-if="open"
                        :text="'Cuando existe exceso de glucosa en la sangre durante un tiempo prolongado los pequeños vasos sanguíneos de los ojos pueden sufrir daños importantes, lo que afecta la salud visual.De acuerdo con la Organización Mundial de la Salud, la retinopatía diabética causa ceguera en el 2,6% de los casos en todo el mundo.Prevenir la diabetes tipo 2 es necesario para impedir diversos problemas de salud que tu organismo puede manifestar con la enfermedad.Se recomienda a todo diabético realizarse con frecuencia controles de glucosa en sangre. Así como también tomar periódicamente su presión arterial, controlar el colesterol y evitar el tabaco. Y verse el fondo del ojo una vez al año.'"
                        :question="'¿La diabetes debilita la visión?'" @toggleState="toggleQuestion('q4')" />
                </transition>
                <transition name="fade">
                    <Question :state="q5" :text="''"
                        :additionalInfo="['Lentes: Permiten corregir a tiempo las afecciones que perjudican la agudeza visual.', '-	Cirugías: Con el avance de la tecnología han incrementado las cirugías oculares. Las más comunes tratan defectos refractivos como presbicia, astigmatismo, hipermetropía y miopía.', 'Gotas: Hay una gran cantidad de gotas para los ojos. La más comunes son las lágrimas artificiales que tratan el ojo seco.Al igual que en el caso de la cirugía, se recomienda contar con la opinión del médico oftalmólogo antes de adquirir gotas oculares en la farmacia.Una vez que comiences el tratamiento con las gotas recuerda seguir las indicaciones del médico.']"
                        :question="'¿Cómo se corrigen las afecciones oculares?'" @toggleState="toggleQuestion('q5')" />
                </transition>
                <transition name="fade">
                    <Question :state="q6" v-if="open"
                        :text="'Es común escuchar: “eres lo que comes” y tu salud visual no se escapa de esos alimentos que pueden beneficiarte gracias a los nutrientes que ofrecen.'"
                        :additionalInfo="['Alimentos con vitamina A  Previenen la sequedad ocular. Para disfrutar los beneficios de estos alimentos se recomienda consumir derivados de animales y vegetales.', 'Alimentos con Omega 3 y 6Siendo estos ácidos determinantes para el desarrollo cerebral, permiten un mejor condicionamiento visual. Entre ellos el pescado azul es la mejor opción para encontrar estos ácidos.', 'Alimentos con Omega 3 y 6 Siendo estos ácidos determinantes para el desarrollo cerebral, permiten un mejor condicionamiento visual. Entre ellos el pescado azul es la mejor opción para encontrar estos ácidos.', 'Vitamina C Se puede hallar en frutas tales como naranja, limón, kiwi, pomelo, guayaba y muchas otras. Además, son excelentes portadoras de antioxidantes primordiales para la salud visual.', 'GrasasDisminuyen las enfermedades oculares y facilitan la lubricación de los ojos siempre y cuando sean grasas saludables.Puedes comerlos en los frutos secos como semillas, almendras, avellanas, cacahuates y linaza.', 'Luteína y zeaxantina Se pueden obtener en los alimentos como en el queso, plantas de hoja verde, yema del huevo, maíz y pistachos.']"
                        :question="'¿Cuáles son los alimentos que mejoran la salud visual?'"
                        @toggleState="toggleQuestion('q6')" />
                </transition>
                <transition name="fade">
                    <Question :state="q7" v-if="open"
                        :text="'Muchos desconocen las consecuencias de este placer momentáneo. Sin embargo, aunque parezca difícil creer, puede derivar en problemas muy graves.Oftalmólogos advierten que frotarse intensa y continuamente los ojos, produce el desarrollo de un síndrome que deforma la estructura interna de la córnea, conocido como queratocono.Dependiendo del grado de esta enfermedad, el paciente puede requerir diferentes tratamientos. Si no se toman medidas, la salud visual estaría muy comprometida a largo plazo.Por otra parte, frotarse los ojos con las manos sucias provoca dos infecciones comunes: conjuntivitis y orzuelos. ¿Por qué? Porque esta parte del cuerpo tiene cientos de bacterias.Frotarse los ojos pueden causar la ruptura de los vasos sanguíneos, lo que provoca ojos irritados y rojos. Además podría ocasionar desprendimiento de vítreo posterior y retina en ojos predispuestos.'"
                        :question="'¿Qué pasa si me froto los ojos constantemente?'"
                        @toggleState="toggleQuestion('q7')" />
                </transition>
                <transition name="fade">
                    <Question :state="q8" v-if="open"
                        :text="' Debes visitar al especialista si con frecuencia sientes irritación en tu globo ocular. A su vez, si tienes picor (típico de la alergia) y secreciones no habituales.'"
                        :question="'¿Cuándo debo consultar el optómetra?'"
                        :additionalInfo="['Si sientes cuerpos extraños durante un largo tiempo en tus ojos.', 'Es motivo de visita cuando observes cambios abruptos en tu visión: puntos negros, luces intermitentes, visión doble…', 'Cuando sientas los párpados inflamados de forma interna, experimentes dolor o punzadas en los ojos.', 'Si posees un orzuelo y en vez de desaparecer empeora.', 'Si dentro de tu familia hay antecedentes de glaucoma o cualquier otra enfermedad ocular.']"
                        @toggleState="toggleQuestion('q8')" />
                </transition>
                <transition name="fade">
                    <Question :state="q9" v-if="open" :text="''" :question="'¿Cómo prevenir problemas visuales?'"
                        :additionalInfo="['Si presentas con frecuencia sequedad ocular, trabajas mucho tiempo al aire libre o con equipos electrónicos, es recomendable utilizar lubricantes en gotas para prevenir así futuras complicaciones.', 'Nunca salgas sin tus gafas de sol, especialmente si vas a pasar mucho tiempo al aire libre.', 'Usa gafas protectoras si tu trabajo es trabajar con productos químicos, de lo contrario pueden ocasionar severos daños a tus ojos.', 'Si practicas alguna actividad deportiva utiliza gorras o gafas para proteger tus ojos de la luz intensa y posibles golpes.', 'Revisa el historial médico de tu familia para descartar o tratar desde muy temprano alguna enfermedad ocular hereditaria.', 'Siempre recuerda visitar al oftalmólogo especialmente en la edad adulta, época donde las enfermedades visuales se presentan frecuentemente.']"
                        @toggleState="toggleQuestion('q9')" />
                </transition>

                <button v-if="!open"
                    class="cursor-pointer px-6 py-2 mt-2 font-medium tracking-wide text-white   transition-colors duration-300 transform   rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                    style="background-color: var(--blue-1);" @click="setOpen()">
                    Mostrar más
                </button>
                <button v-else
                    class="cursor-pointer px-6 py-2 mt-2 font-medium tracking-wide text-white   transition-colors duration-300 transform   rounded-lg hover:bg-blue-500 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-80"
                    style="background-color: var(--blue-1);" @click="setOpen()">
                    Mostrar menos
                </button>
            </div>
        </div>
    </div>
</template>