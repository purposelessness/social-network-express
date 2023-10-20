import path from 'path';
import fs from 'fs';

import * as v from 'valibot';

import {__data_dir} from '~src/config';
import {Entry, EntrySchema, Request} from './entities';
import {ClientError} from '~src/types/errors';
import {checkUserExistence} from '~src/libraries/checkers';

export class UserToFriendRepository {
  private static readonly SAVE_FILENAME = path.join(__data_dir, 'user-to-friend-repository.json');

  private readonly entries: Map<bigint, Set<bigint>> = new Map();

  constructor() {
    this.load();
  }

  public async getEntries(): Promise<Entry[]> {
    const entries: Entry[] = [];
    for (const [uid, ids] of this.entries.entries()) {
      entries.push({
        uid: uid,
        ids: [...ids],
      });
    }
    return entries;
  }

  public async getEntryById(id: bigint): Promise<Entry> {
    if (!this.entries.has(id)) {
      return {
        uid: id,
        ids: [],
      };
    }

    return {
      uid: id,
      ids: [...this.entries.get(id)!],
    };
  }

  public async addFriend(request: Request): Promise<void> {
    await checkUserExistence(request.uid);
    await checkUserExistence(request.id);

    if (this.entries.has(request.uid)) {
      this.entries.get(request.uid)!.add(request.id);
    } else {
      this.entries.set(request.uid, new Set([request.id]));
    }
  }

  public async deleteFriend(request: Request): Promise<void> {
    if (!this.entries.has(request.uid)) {
      throw new ClientError(`User with id ${request.uid} does not exist in user-to-friend repository`);
    }
    this.entries.get(request.uid)!.delete(request.id);
  }

  private load() {
    if (!fs.existsSync(UserToFriendRepository.SAVE_FILENAME)) {
      console.log(`[UserToFriendRepository] File ${UserToFriendRepository.SAVE_FILENAME} does not exist`);
      return;
    }
    let data = fs.readFileSync(UserToFriendRepository.SAVE_FILENAME, 'utf8');
    let entries: Entry[];
    try {
      entries = v.parse(v.array(EntrySchema), JSON.parse(data));
    } catch (e) {
      console.warn(`[UserToFriendRepository] Failed to parse user-to-friend data`);
      return;
    }
    for (const entry of entries) {
      this.entries.set(entry.uid, new Set(entry.ids));
    }
    console.log(`[UserToFriendRepository] Loaded user-to-friend data from ${UserToFriendRepository.SAVE_FILENAME}`);
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