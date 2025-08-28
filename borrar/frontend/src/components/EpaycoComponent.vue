<!-- EpaycoButton.vue -->
<template>
  <div :id="containerId"></div>
</template>

<script setup lang="ts">
import { onMounted, watch, ref } from 'vue';

const props = defineProps<{
  amount: string;
  name: string;
  description: string;
}>();

// ID único para evitar conflictos si hay varios botones en pantalla
const containerId = `epayco-button-${Math.random().toString(36).substring(2, 10)}`;

onMounted(() => {
  insertEpaycoButton();
});

watch(() => [props.amount, props.name, props.description], () => {
  insertEpaycoButton();
});

function insertEpaycoButton() {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = ''; // limpia cualquier script anterior

  const script = document.createElement('script');
  script.src = 'https://checkout.epayco.co/checkout.js';
  script.className = 'epayco-button';
  script.setAttribute('data-epayco-key', 'da79c01f86155c49f6a698202aa12042');
  script.setAttribute('data-epayco-amount', props.amount);
  script.setAttribute('data-epayco-tax', '0.00');
  script.setAttribute('data-epayco-tax-ico', '0.00');
  script.setAttribute('data-epayco-tax-base', props.amount);
  script.setAttribute('data-epayco-name', props.name);
  script.setAttribute('data-epayco-description', props.description);
  script.setAttribute('data-epayco-currency', 'cop');
  script.setAttribute('data-epayco-country', 'CO');
  script.setAttribute('data-epayco-test', 'false');
  script.setAttribute('data-epayco-external', 'false');
  script.setAttribute('data-epayco-response', '');
  script.setAttribute('data-epayco-confirmation', 'https://www.docvisual.co/confirmacion');
  script.setAttribute('data-epayco-button', 'https://multimedia.epayco.co/dashboard/btns/btn5.png');

  container.appendChild(script);
}
</script>
