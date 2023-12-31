import * as v from 'valibot';

import serialize from '~src/libraries/parsers/converter';
import {NewsEntryRecord, NewsEntrySchema} from '~services/news-repository/entities';
import {EntrySchema as UserToNewsEntrySchema} from '~services/user-to-news-repository/entities';
import {ServerError} from '~src/types/errors';
import {__tvm_key, __url} from '~src/config';

export class NewsFeedService {
  public generateNewsFeed = async (uid: bigint): Promise<NewsEntryRecord[]> => {
    const uids = await this.getFriends(uid);
    uids.push(uid);
    const newsListIds = await this.getNewsListIds(uids);
    return await this.getNewsListContent(newsListIds);
  };

  private async getFriends(uid: bigint): Promise<bigint[]> {
    const response = await fetch(`${__url}/api/user-to-friend-repository/${uid}`, {
      method: 'GET',
      headers: {
        Authorization: __tvm_key,
      },
    });
    if (!response.ok) {
      console.warn(`[NewsFeedService] Error on getting friends of user with id ${uid}: ${response.statusText}`);
      throw new ServerError(`Failed to get friends of user with id ${uid}`);
    }
    const json = await response.json();
    return json.ids.map((id: string) => BigInt(id));
  }

  private async getNewsListIds(uids: bigint[]): Promise<bigint[]> {
    const responses: Promise<void>[] = [];
    const newsListIds: bigint[] = [];
    for (const uid of uids) {
      const promise = fetch(`${__url}/api/user-to-news-repository/${uid}`, {
        method: 'GET',
        headers: {
          Authorization: __tvm_key,
        },
      }).then(async (response) => {
        const json = await response.json();
        console.log(`[NewsFeedService] Got news list of user with id ${uid}: ${JSON.stringify(json)}`);
        const entry = v.parse(UserToNewsEntrySchema, json);
        newsListIds.push(...entry.ids);
      }).catch((e) => {
        console.warn(`[NewsFeedService] Error on getting news list of user with id ${uid}: ${e}`);
      });
      responses.push(promise);
    }
    await Promise.all(responses);

    return newsListIds;
  }

  private async getNewsListContent(ids: bigint[]): Promise<NewsEntryRecord[]> {
    if (ids.length === 0) {
      return [];
    }

    const query = serialize(ids);
    const response = await fetch(`${__url}/api/news-repository?ids=${query}`, {
      method: 'GET',
      headers: {
        Authorization: __tvm_key,
      },
    });
    if (!response.ok) {
      console.warn(`Error on getting news list content: ${response.statusText}`);
      throw new Error(`Failed to get news list content`);
    }
    const json = await response.json();
    const newsList = v.parse(v.array(NewsEntrySchema), json);
    return newsList.sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
}
