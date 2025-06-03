import apiClient from './index';

export interface Artist {
  id: string
  name: string
  genres: string[]
  image: string
}

export interface Song {
  id: string
  name: string
  artists: Artist[]
  album: Album
}

export interface SearchSongsByAlbums {
  album: {
    id: string
    name: string
    image: string  
  }
  total: string
  songs: Song[]
}

export interface Album {
  id: string
  name: string
  image: string  
}

export interface Search {
  id: string
  artist_reference: string
  artist_name: string
  search_succeeded: {
    Bool: boolean, 
    Valid: boolean
  }
  download_succeeded: {
    Bool: boolean, 
    Valid: boolean
  }
  total_songs: number
  created_at: string
}

export const getSearch = async () => {
  try {
    const response = await apiClient.get<Search[]>('/me/search');
    return response.data;
  } catch (error) {
    throw error
  }
}

export const createArtistSearch = async (data: {artist_id: string, artist_name: string}) => {
  try {
    await apiClient.post('/me/search', data)
  } catch (error) {
    throw error
  }
}

export const getArtists = async (data :{name: string}) => {
  try {
    const response = await apiClient.post<Artist[]>('/me/search/artists', data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const queryArtistSongs = async (data:{id: string}) => {
  try {
    const response = await apiClient.get<SearchSongsByAlbums[]>(`/me/search/artist-songs/${data.id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const addSongs = async (data:{artist_id: string, song_ids?: string[]}) => {
  try {
    await apiClient.post(`/me/search/artist-songs/${data.artist_id}`, data)
  } catch (error) {
    throw error
  }
}