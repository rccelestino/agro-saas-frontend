// src/api/template.api.ts
import { api } from './axios';

export const templateApi = {
    /**
     * Baixar template Excel do PMO
     */
    downloadTemplatePmo: async (): Promise<Blob> => {
        const response = await api.get('api/template/pmo', {
            responseType: 'blob'
        });
        return response.data;
    }
};
