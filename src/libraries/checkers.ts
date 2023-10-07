import {NotFoundError, ServerError} from '~src/types/errors';

export async function checkUserExistence(uid: bigint): Promise<void> {
  const response = await fetch(`http://localhost:3000/api/user-repository/exists/${uid}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new ServerError(`Failed to check if user with id ${uid} exists`);
  }
  const exists = await response.json();
  if (!exists) {
    throw new NotFoundError(`User with id ${uid} does not exist in user-repository`);
  }
}

export async function checkMessageExistence(id: bigint): Promise<void> {
  const response = await fetch(`http://localhost:3000/api/message-repository/exists/${id}`, {
    method: 'GET',
  });
  if (!response.ok) {
    throw new ServerError(`Failed to check if message with id ${id} exists`);
  }
  const exists = await response.json();
  if (!exists) {
    throw new NotFoundError(`Message with id ${id} does not exist in message-repository`);
  }
}
