import { API_BASE_URL } from '../utils/constants';

export async function getInventories() {
  const response = await fetch(`${API_BASE_URL}/inventories`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch inventories');
  }

  return response.json();
}

export async function getInventory(inventoryId: string) {
  const response = await fetch(`${API_BASE_URL}/inventories/${inventoryId}`, {
    credentials: 'include',
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Failed to fetch inventory');
  }

  return response.json();
}

export async function createInventory(inventoryName: string) {
  const response = await fetch(`${API_BASE_URL}/inventories`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ inventoryName }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (errorData.errors) {
      throw new Error(errorData.errors.join(', '));
    } else {
      throw new Error(errorData.message || 'Failed to create inventory');
    }
  }
  return response.json();
}

export async function modifyUserInventoryRelation(
  userEmail: string,
  inventoryId: number,
  action: string
) {
  const response = await fetch(`${API_BASE_URL}/users/inventories`, {
    method: 'PATCH',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      userEmail,
      inventoryId,
      action,
    }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    if (errorData.errors) {
      throw new Error(errorData.errors.join(', '));
    } else {
      throw new Error(
        errorData.message ||
          `Failed to ${action === 'connect' ? 'add' : 'remove'} user`
      );
    }
  }
  return response.json();
}
