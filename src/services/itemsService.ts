import { API_BASE_URL } from '../utils/constants';

export async function getItems(inventoryId: string, categoryId?: string) {
  const url = categoryId
    ? `${API_BASE_URL}/inventories/${inventoryId}/items?categoryId=${categoryId}`
    : `${API_BASE_URL}/inventories/${inventoryId}/items`;

  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch items');
  }

  return response.json();
}

export async function createItem(
  itemName: string,
  categoryId: number,
  inventoryId: number
) {
  const response = await fetch(`${API_BASE_URL}/items`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ itemName, categoryId, inventoryId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create item');
  }

  return response.json();
}

export async function deleteItem(itemId: number) {
  const response = await fetch(`${API_BASE_URL}/items/${itemId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete category');
  }

  return response.json();
}
