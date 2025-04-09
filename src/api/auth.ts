import apiClient from './index';

export interface Token {
  token: string
}

export const login = async (data: {username: string, password: string}): Promise<Token> => {
  try {
    const response = await apiClient.post<Token>('/auth/login', data);

    return response.data;  
  } catch(error) {
    console.error('Error getting playlist:', error);
    throw error;
  }
}
