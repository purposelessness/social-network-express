import path from 'path';
import fs from 'fs';

import * as v from 'valibot';

import {__data_dir} from '~src/config';
import {Entry, EntrySchema, Request} from './entities';
import {NotFoundError} from '~src/types/errors';
import {checkMessageExistence, checkUserExistence} from '~src/libraries/checkers';

export class UserToMessageRepository {
  private static readonly SAVE_FILENAME = path.join(__data_dir, 'user-to-message-repository.json');

  private readonly entries: Map<bigint, Set<bigint>> = new Map();

  constructor() {
    this.load();
  }

  public async getEntries(): Promise<Entry[]> {
    const entries: Entry[] = [];
    for (const [uid, messageIds] of this.entries.entries()) {
      entries.push({
        uid: uid,
        ids: [...messageIds],
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

  public async addMessage(request: Request): Promise<void> {
    await checkUserExistence(request.uid);
    await checkMessageExistence(request.messageId);

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

  private load() {
    if (!fs.existsSync(UserToMessageRepository.SAVE_FILENAME)) {
      console.log(`[UserToMessageRepository] File ${UserToMessageRepository.SAVE_FILENAME} does not exist`);
      return;
    }
    let data = fs.readFileSync(UserToMessageRepository.SAVE_FILENAME, 'utf8');
    let entries: Entry[];
    try {
      entries = v.parse(v.array(EntrySchema), JSON.parse(data));
    } catch (e) {
      console.warn(`[UserToMessageRepository] Failed to parse user-to-message data`);
      console.log(e);
      return;
    }
    for (const entry of entries) {
      this.entries.set(entry.uid, new Set(entry.ids));
    }
    console.log(`[UserToMessageRepository] Loaded user-to-message data from ${UserToMessageRepository.SAVE_FILENAME}`);
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
}