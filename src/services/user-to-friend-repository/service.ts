import path from 'path';
import fs from 'fs';

import {__src_dir} from '~src/config';
import {Entry, Request} from './entities';
import {ClientError} from '~src/types/errors';

export class UserToFriendRepository {
  private static readonly SAVE_FILENAME = path.join(__src_dir, 'data', 'user-to-friend-repository.json');

  private readonly entries: Map<bigint, Set<bigint>> = new Map();

  public async getEntries(): Promise<Entry[]> {
    const entries: Entry[] = [];
    for (const [uid, ids] of this.entries.entries()) {
      entries.push({
        uid: uid,
        ids: ids,
      });
    }
    return entries;
  }

  public async getEntryById(id: bigint): Promise<Entry> {
    if (!this.entries.has(id)) {
      throw new ClientError(`User with id ${id} does not exist in user-to-friend repository`);
    }
    return {
      uid: id,
      ids: this.entries.get(id)!,
    };
  }

  public async addFriend(request: Request): Promise<void> {
    if (this.entries.has(request.uid)) {
      this.entries.get(request.uid)!.add(request.friendId);
    } else {
      this.entries.set(request.uid, new Set([request.friendId]));
    }
  }

  public async deleteFriend(request: Request): Promise<void> {
    if (!this.entries.has(request.uid)) {
      throw new ClientError(`User with id ${request.uid} does not exist in user-to-friend repository`);
    }
    this.entries.get(request.uid)!.delete(request.friendId);
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
    if (!fs.existsSync(path.dirname(UserToFriendRepository.SAVE_FILENAME))) {
      fs.mkdirSync(path.dirname(UserToFriendRepository.SAVE_FILENAME));
      console.log(`[UserToFriendRepository] Created directory ${path.dirname(UserToFriendRepository.SAVE_FILENAME)}`);
    }
    fs.writeFile(UserToFriendRepository.SAVE_FILENAME, data, (err) => {
      if (err) {
        console.warn(`[UserToFriendRepository] Failed to save entries to ${UserToFriendRepository.SAVE_FILENAME}`);
        throw err;
      }
      console.log(`[UserToFriendRepository] Saved entries to ${UserToFriendRepository.SAVE_FILENAME}`);
    });
  }
}