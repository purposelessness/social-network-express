import path from 'path';
import fs from 'fs';

import * as v from 'valibot';

import {__data_dir, __tvm_key, __url} from '~src/config';
import {NewsEntryRecord, NewsEntrySchema, NewsRecord} from './entities';
import {NotFoundError} from '~src/types/errors';
import {checkUserExistence} from '~src/libraries/checkers';
import serialize from '~src/libraries/parsers/converter';
import {getIo} from '~src/socket';

export class NewsRepository {
  private static readonly SAVE_FILENAME = path.join(__data_dir, 'news-repository.json');
  private static UNIQUE_ID = 0n;

  private news: Map<bigint, NewsEntryRecord> = new Map();

  constructor() {
    this.load();
  }

  public getNewsList = async (ids: bigint[]): Promise<NewsEntryRecord[]> => {
    const news: NewsEntryRecord[] = [];
    for (const id of ids) {
      if (this.news.has(id)) {
        news.push(this.news.get(id)!);
      }
    }
    return news;
  };

  public getNews = async (id: bigint): Promise<NewsEntryRecord> => {
    if (!this.news.has(id)) {
      throw new NotFoundError(`News with id ${id} does not exist in news repository`);
    }
    return this.news.get(id)!;
  };

  public doesNewsExist = async (id: bigint): Promise<boolean> => {
    return this.news.has(id);
  };

  public addNews = async (news: NewsRecord): Promise<bigint> => {
    await checkUserExistence(news.uid);
    const id = NewsRepository.UNIQUE_ID++;

    await fetch(`${__url}/api/user-to-news-repository`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: __tvm_key,
      },
      body: JSON.stringify(serialize({
        uid: news.uid,
        newsId: id,
      })),
    }).then(async (response) => {
      if (!response.ok) {
        console.warn(`[NewsRepository] Error on adding news with id ${id} to user with id ${news.uid}: ${response.statusText}`);
      }
    }).catch((e) => {
      console.warn(`[NewsRepository] Error on adding news with id ${id} to user with id ${news.uid}: ${e}`);
    });

    const n = {
      id: id,
      uid: news.uid,
      text: news.text,
      createdAt: news.createdAt,
    }
    this.news.set(id, n);
    getIo().emit('news', serialize(n));
    return id;
  };

  public deleteNews = async (id: bigint): Promise<void> => {
    if (!this.news.has(id)) {
      throw new NotFoundError(`News with id ${id} does not exist in news repository`);
    }
    this.news.delete(id);
  };

  private load() {
    if (!fs.existsSync(NewsRepository.SAVE_FILENAME)) {
      console.log(`[NewsRepository] File ${NewsRepository.SAVE_FILENAME} does not exist`);
      return;
    }
    let data = fs.readFileSync(NewsRepository.SAVE_FILENAME, 'utf8');
    let allNews: NewsEntryRecord[];
    try {
      allNews = v.parse(v.array(NewsEntrySchema), JSON.parse(data));
    } catch (e) {
      console.warn(`[NewsRepository] Failed to parse news data`);
      console.log(e);
      return;
    }
    for (const news of allNews) {
      this.news.set(news.id, news);
    }
    NewsRepository.UNIQUE_ID = BigInt(this.news.size);
    console.log(`[NewsRepository] Loaded all news from ${NewsRepository.SAVE_FILENAME}`);
  }


  public save = async (): Promise<void> => {
    const json = [];
    for (const news of this.news.values()) {
      json.push({
        id: news.id.toString(),
        uid: news.uid.toString(),
        text: news.text,
        createdAt: news.createdAt,
      });
    }
    const data = JSON.stringify(json);
    if (!fs.existsSync(path.dirname(NewsRepository.SAVE_FILENAME))) {
      fs.mkdirSync(path.dirname(NewsRepository.SAVE_FILENAME));
      console.log(`[NewsRepository] Created directory ${path.dirname(NewsRepository.SAVE_FILENAME)}`);
    }
    fs.writeFile(NewsRepository.SAVE_FILENAME, data, (err) => {
      if (err) {
        console.warn(`[NewsRepository] Failed to save all news to ${NewsRepository.SAVE_FILENAME}`);
        throw err;
      }
      console.log(`[NewsRepository] Saved all news to ${NewsRepository.SAVE_FILENAME}`);
    });
  };
}