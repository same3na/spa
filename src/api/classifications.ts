
import apiClient from './index';
import { Artist } from './songs';

export interface Classification {
  id: string
  name: string
  description: string
  songs: string[]
  features: any
  is_ai_generated: boolean
}

interface ArtistSongsNumber {
  artist: Artist
  total: number
}

export interface ClassificationDetail {
  classification: Classification
  artists: ArtistSongsNumber[]
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

export const getClassificationDetail = async (id:string) => {
  try {
    const response = await apiClient.get<ClassificationDetail>(`/me/classification-details/${id}`)
    return response.data
  } catch (error) {
    throw error;
  }
}