import SongSingle from '@/pages/songs/Single';
import {apiClient} from './index';
import { PagingResponse } from './paging';

export interface Artist {
  id: string
  reference: string
  name: string
}

export interface Song {
  id: string
  title: string
  album_name: string
  artist: Artist
  external_url: string
  features: any
  analyze_success: {
    Bool: boolean, 
    Valid: boolean
  }
}

export interface SongSingle extends Song{
  features: {
    genres: {
      name: string
      value: number
    }[],
    aggressive: number,
    engagement: number,
    happy: number,
    relaxed: number,
    sad: number,
    moods: {
      name: string
      value: number
    }[],
  }
}

export const getSongs = async (data: {page: number, limit: number, search: string | null, ids?: Array<string>, artistIds?: Array<string>}): Promise<PagingResponse<Song>> => {
  try {
    let params: {
      page: number
      limit: number
      search: string | null
      ids?: Array<string>
      filter?: {
        [key: string]: string[];
      };
    } = {
      page: data.page, 
      limit: data.limit, 
      search: data.search
    }

    if (data.ids) {
      params.ids = data.ids
    }

    if (data.artistIds && data.artistIds.length > 0) {
      params.filter = {
        'artists': data.artistIds
      }
    }

    const response = await apiClient.post<PagingResponse<Song>>('/query-songs', params);

    return response.data;

  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getPlaylist = async (data: {song_id: string, artist_ids?: string[], in_song_ids?: string[]}): Promise<Song[]> => {
  try {
    const response = await apiClient.post<Song[]>('/playlist', data);

    return response.data;  
  } catch(error) {
    console.error('Error getting playlist:', error);
    throw error;
  }
}

export const getSongsArtist = async (): Promise<Artist[]> => {
  try {
    const response = await apiClient.get<Artist[]>(`/artists`)

    return response.data;

  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export const getSongIdsByArtists = async (data: {artist_ids: string[]}): Promise<string[]> => {
  try {
    const response = await apiClient.post<string[]>(`/song-ids`, data)

    return response.data;

  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export const getSingleSong = async (id:string): Promise<any> => {
  try {
    const response = await apiClient.get<SongSingle>(`/songs/${id}`)

    return response.data;

  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}