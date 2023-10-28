import path from 'path';
import fs from 'fs';

import * as v from 'valibot';

import {__data_dir} from '~src/config';
import {Entry, EntrySchema, Request} from './entities';
import {NotFoundError} from '~src/types/errors';
import {checkNewsExistence, checkUserExistence} from '~src/libraries/checkers';

export class UserToNewsRepository {
  private static readonly SAVE_FILENAME = path.join(__data_dir, 'user-to-news-repository.json');

  private readonly entries: Map<bigint, Set<bigint>> = new Map();

  constructor() {
    this.load();
  }

  public async getEntries(): Promise<Entry[]> {
    const entries: Entry[] = [];
    for (const [uid, newsListIds] of this.entries.entries()) {
      entries.push({
        uid: uid,
        ids: [...newsListIds],
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

  public async addLink(request: Request): Promise<void> {
    await checkUserExistence(request.uid);
    await checkNewsExistence(request.newsId);

    if (this.entries.has(request.uid)) {
      this.entries.get(request.uid)!.add(request.newsId);
    } else {
      this.entries.set(request.uid, new Set([request.newsId]));
    }
  }

  public async deleteLink(request: Request): Promise<void> {
    if (!this.entries.has(request.uid)) {
      throw new NotFoundError(`User with id ${request.uid} does not exist in user-to-news repository`);
    }
    this.entries.get(request.uid)!.delete(request.newsId);
  }

  private load() {
    if (!fs.existsSync(UserToNewsRepository.SAVE_FILENAME)) {
      console.log(`[UserToNewsRepository] File ${UserToNewsRepository.SAVE_FILENAME} does not exist`);
      return;
    }
    let data = fs.readFileSync(UserToNewsRepository.SAVE_FILENAME, 'utf8');
    let entries: Entry[];
    try {
      entries = v.parse(v.array(EntrySchema), JSON.parse(data));
    } catch (e) {
      console.warn(`[UserToNewsRepository] Failed to parse user-to-news data`);
      console.log(e);
      return;
    }
    for (const entry of entries) {
      this.entries.set(entry.uid, new Set(entry.ids));
    }
    console.log(`[UserToNewsRepository] Loaded user-to-news data from ${UserToNewsRepository.SAVE_FILENAME}`);
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
    if (!fs.existsSync(path.dirname(UserToNewsRepository.SAVE_FILENAME))) {
      fs.mkdirSync(path.dirname(UserToNewsRepository.SAVE_FILENAME));
      console.log(`[UserToNewsRepository] Created directory ${path.dirname(UserToNewsRepository.SAVE_FILENAME)}`);
    }
    fs.writeFile(UserToNewsRepository.SAVE_FILENAME, data, (err) => {
      if (err) {
        console.warn(`[UserToNewsRepository] Failed to save entries to ${UserToNewsRepository.SAVE_FILENAME}`);
        throw err;
      }
      console.log(`[UserToNewsRepository] Saved entries to ${UserToNewsRepository.SAVE_FILENAME}`);
    });
  }
}