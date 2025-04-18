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