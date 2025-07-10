import apiClient from ".";

export interface Group {
  id: string
  name: string
  description: string
}

export const getGroups = async() => {
  const response = await apiClient.get<Group[]>('/me/groups');

  return response.data;
}

export const removeArtistSearchFromGroup = async (data: {search_id: string}) => {
  try {
    const response = await apiClient.post('/me/remove-search-from-group', data);
    return response.data;
  } catch (error) {
    console.error('Error removing artist from group:', error);
    throw error;
  }
}