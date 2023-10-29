import {NotFoundError, ServerError} from '~src/types/errors';
import {__tvm_key, __url} from '~src/config';

export async function checkUserExistence(uid: bigint): Promise<void> {
  const promise = fetch(`${__url}/api/user-repository/exists/${uid}`, {
    method: 'GET',
    headers: {
      Authorization: __tvm_key,
    },
  }).then(response => {
    if (!response.ok) {
      throw new ServerError(`Failed to check if user with id ${uid} exists: ${response.statusText}}`);
    }
    return response.json();
  }).then(exists => {
    if (!exists) {
      throw new NotFoundError(`User with id ${uid} does not exist in user-repository`);
    }
  }).catch((e) => {
    console.error(`Failed to check if user with id ${uid} exists: ${e}`);
  })
}

export async function checkNewsExistence(id: bigint): Promise<void> {
  const promise = fetch(`${__url}/api/news-repository/exists/${id}`, {
    method: 'GET',
    headers: {
      Authorization: __tvm_key,
    },
  }).then(response => {
    if (!response.ok) {
      throw new ServerError(`Failed to check if news with id ${id} exists: ${response.statusText}}`);
    }
    return response.json();
  }).then(exists => {
    if (!exists) {
      throw new NotFoundError(`News with id ${id} does not exist in news-repository`);
    }
  }).catch((e) => {
    console.error(`Failed to check if news with id ${id} exists: ${e}`);
  });
}
