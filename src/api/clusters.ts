import axios from 'axios';
import apiClient from './index';

export interface Song {
  id: string
  cluster: number
  favorite: boolean
}

export interface Cluster {
  id: string
  description: string
  cluster_nb: number
  songs: Song[]
}

export interface Specification {
  id: string
  type: string
  cluster: Cluster
  song_ids: string[]
}

export const getClusters = async () => {
  try {
    const response = await apiClient.get<Cluster[]>('/me/clusters');
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const getSingleCluster = async (id:string) => {
  try {
    const response = await apiClient.get<Cluster>(`/me/clusters/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
}

export const deleteCluster = async (id:string) => {
  try {
    await apiClient.delete(`/me/clusters/${id}`)
  } catch (error) {
    throw error
  }
}

export const createCluster = async (data:{song_ids:string[], description:string, cluster_nb: number}) => {
  try {
    await apiClient.post('/me/clusters', data);
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        throw new Error(error.response.data.message)
      } else if (error.request) {
        // No response received from the server
        console.error('No response from server:', error.request);
      } else {
        // Something else happened while setting up the request
        console.error('Error Message:', error.message);
      }
    } else {
      // Non-Axios error
      console.error('Unexpected Error:', error);
    }
  }
}

export const setSongFavorite = async (data:{cluster_id:string, songs:{id: string, is_favorite: boolean}[]}) => {
  try {
    await apiClient.post('/me/clusters/update-favorites', data);
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        throw new Error(error.response.data.message)
      } else if (error.request) {
        // No response received from the server
        console.error('No response from server:', error.request);
      } else {
        // Something else happened while setting up the request
        console.error('Error Message:', error.message);
      }
    } else {
      // Non-Axios error
      console.error('Unexpected Error:', error);
    }
  }
}

export const getSpecifications = async (cluster_id:string) => {
  try {
    const response = await apiClient.get<Array<Specification>>(`/me/clusters/${cluster_id}/specifications`);
    return response.data;
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        throw new Error(error.response.data.message)
      }
    }
    throw error
  }
}

export const getSingleSpecification = async (id: string) => {
  try {
    const response = await apiClient.get<Specification>(`/me/clusters/specifications/${id}`);
    return response.data;
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        throw new Error(error.response.data.message)
      }
    }
    throw error
  }
}

export const createSpecification = async(data:{ cluster_id: string, type: string, song_ids: string[] }) => {
  try {
    await apiClient.post('/me/clusters/specifications', data);
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        throw new Error(error.response.data.message)
      }
    }
    throw error
  }
}

export const updateSpecification = async(data: {specification_id: string, type: string, song_ids: string[]}) => {
  try {
    await apiClient.put(`/me/clusters/specifications/${data.specification_id}`, data);
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        throw new Error(error.response.data.message)
      }
    }
    throw error
  }
}

export const deleteSpecification = async(specification_id: string) => {
  try {
    await apiClient.delete(`/me/clusters/specifications/${specification_id}`);
  } catch (error) {
    console.log(error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // Server responded with a status code outside the 2xx range
        throw new Error(error.response.data.message)
      }
    }
    throw error
  }

}