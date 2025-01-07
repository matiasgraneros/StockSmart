import { API_BASE_URL } from '../utils/constants';

export async function getCategories(inventoryId: string) {
  const response = await fetch(`${API_BASE_URL}/categories/${inventoryId}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch categories');
  }

  return response.json();
}

export async function createCategory(
  categoryName: string,
  inventoryId: number
) {
  const response = await fetch(`${API_BASE_URL}/categories`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ categoryName, inventoryId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to create category');
  }

  return response.json();
}

export async function deleteCategory(categoryId: number) {
  const response = await fetch(`${API_BASE_URL}/categories/${categoryId}`, {
    method: 'DELETE',
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to delete category');
  }

  return response.json();
}
