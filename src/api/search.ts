import {apiClient} from './index';

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
  artist_id: String
  artist_name: String
  succeeded: boolean
  error_message: string
  total: number
  current_album_nb: number
  created_at: string
}

export const getSearch = async () => {
  try {
    const response = await apiClient.get<Search[]>('/search');
    return response.data;
  } catch (error) {
    throw error
  }
}

export const createArtistSearch = async (data: {artist_id: string, artist_name: string}) => {
  try {
    await apiClient.post('/search', data)
  } catch (error) {
    throw error
  }
}

export const getArtists = async (data :{name: string}) => {
  try {
    const response = await apiClient.get<Artist[]>('/search/artists', {params: data});
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const queryArtistSongs = async (data:{id: string}) => {
  try {
    const response = await apiClient.get<SearchSongsByAlbums[]>(`/search/artist-songs/${data.id}`)
    return response.data
  } catch (error) {
    throw error
  }
}

export const addSongs = async (data:{artist_id: string, song_ids: string[]}) => {
  try {
    await apiClient.post(`/search/artist-songs/${data.artist_id}`, data)
  } catch (error) {
    throw error
  }
}