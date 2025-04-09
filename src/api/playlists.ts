import apiClient from './index';
import { Artist } from './songs';


export interface Playlist {
  id: string
  slug: string
  has_all_songs: boolean
  artists: Artist[] | null
  classifications: PlaylistClassification[]
}

export interface PlaylistClassification {
  weight: number
  classification: Classification
}

export interface Classification {
  id: string
  slug: string
  criterias: [{
    feature: string
    operation: string
    value: string
  }]
}

export const getClassifications = async () => {
  try {
    const response = await apiClient.get<Classification[]>('/me/classifications');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getPlaylists = async () => {
  try {
    const response = await apiClient.get<Playlist[]>('/me/playlists');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getPlaylistSongIds = async (data: {has_all_songs: boolean, song_ids:string[], criterias:any[], playlist_max_nb:number}) => {
  try {
    const response = await apiClient.post<string[]>('/me/filter-songs-by-classification', data);
    return response.data;
  } catch (error) {
    throw error;
  }
}