<script lang="ts">
import Panel_user_notifications from '../../Panel_User_Professional/notification/Panel_user_notifications.vue';

export default {
    name: 'Modal_Notifications',
    components: {
        Panel_user_notifications
    }
}
</script>

<template>
    <div class="w-full  ">
 

        <Panel_user_notifications key="2"
            class="max-h-[65dvh] min-h-[65dvh] overflow-y-auto bg-white" />
    </div>
</template>