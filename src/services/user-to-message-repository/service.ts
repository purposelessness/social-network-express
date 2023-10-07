import path from 'path';
import fs from 'fs';

import {__src_dir} from '~src/config';
import {Entry, Request} from './entities';
import {NotFoundError, ServerError} from '~src/types/errors';

export class UserToMessageRepository {
  private static readonly SAVE_FILENAME = path.join(__src_dir, 'data', 'user-to-message-repository.json');

  private readonly entries: Map<bigint, Set<bigint>> = new Map();

  public async getEntries(): Promise<Entry[]> {
    const entries: Entry[] = [];
    for (const [uid, messageIds] of this.entries.entries()) {
      entries.push({
        uid: uid,
        messageIds: [...messageIds],
      });
    }
    return entries;
  }

  public async getEntryById(id: bigint): Promise<Entry> {
    if (!this.entries.has(id)) {
      throw new NotFoundError(`User with id ${id} does not exist in user-to-message repository`);
    }
    return {
      uid: id,
      messageIds: [...this.entries.get(id)!],
    };
  }

  public async addMessage(request: Request): Promise<void> {
    await UserToMessageRepository.checkUserExistence(request.uid);
    if (this.entries.has(request.uid)) {
      this.entries.get(request.uid)!.add(request.messageId);
    } else {
      this.entries.set(request.uid, new Set([request.messageId]));
    }
  }

  public async deleteMessage(request: Request): Promise<void> {
    if (!this.entries.has(request.uid)) {
      throw new NotFoundError(`User with id ${request.uid} does not exist in user-to-message repository`);
    }
    this.entries.get(request.uid)!.delete(request.messageId);
  }

  public async save(): Promise<void> {
    const json = [];
    for (const [uid, ids] of this.entries.entries()) {
      json.push({
        uid: uid.toString(),
        ids: [...ids].map((id) => id.toString()),
      });
    }
    const data = JSON.stringify(json);
    if (!fs.existsSync(path.dirname(UserToMessageRepository.SAVE_FILENAME))) {
      fs.mkdirSync(path.dirname(UserToMessageRepository.SAVE_FILENAME));
      console.log(`[UserToMessageRepository] Created directory ${path.dirname(UserToMessageRepository.SAVE_FILENAME)}`);
    }
    fs.writeFile(UserToMessageRepository.SAVE_FILENAME, data, (err) => {
      if (err) {
        console.warn(`[UserToMessageRepository] Failed to save entries to ${UserToMessageRepository.SAVE_FILENAME}`);
        throw err;
      }
      console.log(`[UserToMessageRepository] Saved entries to ${UserToMessageRepository.SAVE_FILENAME}`);
    });
  }

  private static async checkUserExistence(uid: bigint): Promise<void> {
    const response = await fetch(`http://localhost:3000/api/user-repository/exists/${uid}`, {
      method: 'GET',
    });
    if (!response.ok) {
      throw new ServerError(`Failed to check if user with id ${uid} exists`);
    }
    const exists = await response.json();
    if (!exists) {
      throw new NotFoundError(`User with id ${uid} does not exist in user-to-message repository`);
    }
  }
}