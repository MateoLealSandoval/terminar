import type { ModelResponse } from "@/models/AxiosResponse";
import { MyAcconutTypesModal } from "@/Modules/Panel_User/TypeModal_MyAccount";
import axios from "axios";
import { defineStore } from "pinia";

export const storeUserPanel = defineStore('storeUserPanel', {
  state: () => ({
    selectPanel: MyAcconutTypesModal.INIT as MyAcconutTypesModal,
    notificationPengins: 0,
  }),
  actions: {
    async setPanel(value: MyAcconutTypesModal) {
      this.selectPanel = value;
    },
    async resetPanel() {
      this.selectPanel = MyAcconutTypesModal.INIT;
      // puedes usar page para lógica adicional si es necesario
    },
    async getNotificationsPendings() {
      try {
        const response = await axios.get<ModelResponse<number>>(`/notification/pendings`)
        const { data, status } = response.data;
        if (status === 200) {
          this.notificationPengins = data
      
        } else {
          throw new Error("Respuesta inesperada del servidor.");
        }
      } catch (error: any) {
        if (axios.isAxiosError(error)) {
          throw new Error(error.response?.data?.message || "Error en el registro.");

        } else {
          throw new Error("Ha ocurrido un error inesperado.");
        }
      }
    }
  },
});
