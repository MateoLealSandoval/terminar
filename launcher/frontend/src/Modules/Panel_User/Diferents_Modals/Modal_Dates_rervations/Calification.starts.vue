<script lang="ts">

import { defineComponent, ref } from 'vue';

export default defineComponent({
    name: 'calification_starts',
    emits: ['score_action'],
    props: {
        text: {
            type: String,
            required: true
        },
        score: {
            type: Number,
            required: true
        },
    },
    setup(props, { emit }) {
        const score = ref<number>(0);
        const select_score = (value: number) => {
            if (props.score === 1 && value === 1) {
                emit('score_action', 0);

            } else {
                emit('score_action', value); // envía el número al padre
            }

        }

        return {
            props,
            select_score
        }
    }
});
</script>

<template>

    <div class="w-full bg-white rounded-2xl mx-auto mb-10 ">

        <h1 class="text-xs font-light    mb-2">{{ props.text }}</h1>
        <div class="flex flex-wrap mb-3 gap-1">
            <svg v-for="n in 5" class="ml-1 w-4 h-4 md:h-5 md:w-5 cursor-pointer" :class="{
                'text-amber-400': n <= props.score,
                'text-gray-300': n > props.score
            }" viewBox="0 0 32 32" version="1.1" xmlns="http://www.w3.org/2000/svg"
                xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:sketch="http://www.bohemiancoding.com/sketch/ns"
                @click="select_score(n)">
                <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd" sketch:type="MSPage">
                    <g id="Icon-Set-Filled" sketch:type="MSLayerGroup" transform="translate(-154.000000, -881.000000)"
                        fill="currentColor">
                        <path
                            d="M186,893.244 L174.962,891.56 L170,881 L165.038,891.56 L154,893.244 L161.985,901.42 L160.095,913 L170,907.53 L179.905,913 L178.015,901.42 L186,893.244"
                            id="start-favorite" sketch:type="MSShapeGroup" />
                    </g>
                </g>
            </svg>
    
        </div>
    </div>


</template>
