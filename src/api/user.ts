import apiClient from './index';

export interface SongLiked {
  songs_liked: {id: string}[]
}

export interface IsSongLiked {
  is_liked: boolean
}

export const getLikedSongs = async():Promise<string[]> => {
  const response = await apiClient.get<SongLiked>('/me/liked-songs');

  var ids = response.data.songs_liked.map((ele) => {return ele.id});

  return ids
}

export const isLikedSong = async(data: {song_id: string}):Promise<boolean> => {
  const response = await apiClient.get<IsSongLiked>(`/me/is-song-liked/${data.song_id}`);

  return response.data.is_liked
}

export const LikeSong = async(data: {song_id: string}):Promise<void> => {
  await apiClient.post('/me/like-song', data)
}

export const DislikeSong = async(data: {song_id: string}):Promise<void> => {
  await apiClient.post('/me/dislike-song', data)
}