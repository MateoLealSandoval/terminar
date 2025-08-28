<script lang="ts" setup>
import type { notifications } from '@/dto/notifications';
import { useNotificationsStore } from '@/store';
import { onMounted, watch } from 'vue';
import { storeUserPanel } from '../../../store/store_user_panel/panelsusers.store';
import { formatHumanDateCO,   } from '@/utils/DateUtils';
 
const props = defineProps<{
  notification: notifications
}>();
const notificationstore = useNotificationsStore()
const storePanelUser = storeUserPanel()
onMounted(async () => {
  await notificationstore.getNotification(props.notification);
});

watch(
  () => props.notification,
  async (newVal) => {
    await notificationstore.getNotification(newVal);
    await storePanelUser.getNotificationsPendings()
  },
  { deep: true, immediate: false }
);
</script>

<template>
  <div class="font-poppins">
    <div class="w-full  p-5 rounded-2xl bg-white mb-5 font-poppins">
      <div class="flex items-center gap-4">
        <hr class="flex-grow border-gray-300">
        <span class="font-bold text-sm text-gray-600 whitespace-nowrap">
         {{ formatHumanDateCO(new Date(props.notification.createdAt)) }}
        </span>
        <hr class="flex-grow border-gray-300">
      </div>
    </div>

    <div class="w-full   p-5 md:p-10 rounded-2xl bg-white min-h-50 flex flex-col">
      <div class="my-1   flex-1 flex items-center justify-center">

        <p class="m-3">
          <span class="font-bold mr-1">{{ props.notification.title }}</span>{{ props.notification.message }}
        </p>



      </div>
    </div>
  </div>
</template>
