import { API_BASE_URL } from '../utils/constants';

export async function getUsers(inventoryId: string) {
  const response = await fetch(
    `${API_BASE_URL}/inventories/${inventoryId}/users`,
    {
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch users');
  }

  return response.json();
}
