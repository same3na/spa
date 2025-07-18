
import apiClient from './index';

export interface Classification {
  id: string
  name: string
  description: string
  songs: string[]
  features: any
  is_ai_generated: boolean
}

export const getClassifications = async () => {
  try {
    const response = await apiClient.get<Classification[]>('/me/classifications');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const aiSyncClassifications = async () => {
    try {
    const response = await apiClient.post<null>('/me/sync-ai-classifications');
    return response.data;
  } catch (error) {
    throw error;
  }
}