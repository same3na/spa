import SongSingle from '@/pages/songs/Single';
import apiClient from './index';
import { PagingResponse } from './paging';

export interface SongsCriteriaFilter {
  feature: string
  operation: string
  value: string
}

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
    bool: boolean, 
    valid: boolean
  }
}

export interface SongFilters {
  moods: string[]
  genres: string[]
}

export interface SongSingle extends Song{
  features: {
    genre: {
      name: string
      value: number
    }[],
    aggressive: number,
    engagement: number,
    happy: number,
    relaxed: number,
    sad: number,
    mood: {
      name: string
      value: number
    }[],
  }
}

export const getSongs = async (data: {page: number, limit: number, search: string | null, ids?: Array<string>, artistIds?: Array<string>, featureFilter?: Array<SongsCriteriaFilter>}): Promise<PagingResponse<Song>> => {
  try {
    let params: {
      page: number
      limit: number
      search: string | null
      ids?: Array<string>
      artists_ids?: Array<string>
      feature_filter?: Array<SongsCriteriaFilter>;
    } = {
      page: data.page, 
      limit: data.limit, 
      search: data.search
    }

    if (data.ids) {
      params.ids = data.ids
    }

    if (data.artistIds && data.artistIds.length > 0) {
      params.artists_ids = data.artistIds
    }

    if (data.featureFilter && data.featureFilter.length > 0) {
      params.feature_filter = data.featureFilter
    }

    const response = await apiClient.post<PagingResponse<Song>>('/me/query-songs', params);
    return response.data;

  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

export const getPlaylist = async (data: {song_id?: string, artist_ids?: string[], in_song_ids?: string[], feature_filter?: Array<SongsCriteriaFilter>}): Promise<Song[]> => {
  try {
    const response = await apiClient.post<Song[]>('/me/playlist', data);

    return response.data;  
  } catch(error) {
    console.error('Error getting playlist:', error);
    throw error;
  }
}

export const getSongsArtist = async (): Promise<Artist[]> => {
  try {
    const response = await apiClient.get<Artist[]>(`/me/artists`)

    return response.data;

  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export const getFilters = async (data: {song_ids: string[]}): Promise<SongFilters> => {
  const response = await apiClient.post<SongFilters>(`/me/songs-filters`, data)

  return response.data
}

export const getSongIdsByArtists = async (data: {artist_ids: string[]}): Promise<string[]> => {
  try {
    const response = await apiClient.post<string[]>(`/me/song-ids`, data)

    return response.data;

  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}

export const getSingleSong = async (id:string): Promise<any> => {
  try {
    const response = await apiClient.get<SongSingle>(`/me/songs/${id}`)

    return response.data;

  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
}