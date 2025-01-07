import { API_BASE_URL } from '../utils/constants';

export async function getAllOperations(inventoryId: string, page: number) {
  const response = await fetch(
    `${API_BASE_URL}/operations/inventories/${inventoryId}?page=${page}&limit=10`,
    {
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch operations');
  }

  return response.json();
}

export async function getOperationsByUser(
  inventoryId: string,
  userId: number,
  page: number
) {
  const response = await fetch(
    `${API_BASE_URL}/operations/inventories/${inventoryId}/users/${userId}?page=${page}&limit=10`,
    {
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch operations');
  }

  return response.json();
}

export async function getOperationsByCategory(
  inventoryId: string,
  categoryId: number,
  page: number
) {
  const response = await fetch(
    `${API_BASE_URL}/operations/inventories/${inventoryId}/categories/${categoryId}?page=${page}&limit=10`,
    {
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch operations');
  }

  return response.json();
}

export async function getOperationsByItem(
  inventoryId: string,
  itemId: number,
  page: number
) {
  const response = await fetch(
    `${API_BASE_URL}/operations/inventories/${inventoryId}/items/${itemId}?page=${page}&limit=10`,
    {
      credentials: 'include',
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch operations');
  }

  return response.json();
}

export async function createOperation(
  operationType: 'ADD' | 'REMOVE',
  quantity: number,
  inventoryId: number,
  itemId: number
) {
  const response = await fetch(`${API_BASE_URL}/operations`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ operationType, quantity, inventoryId, itemId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create operation');
  }

  return response.json();
}
