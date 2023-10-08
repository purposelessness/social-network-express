import * as v from 'valibot';

import serialize from '~src/libraries/parsers/converter';
import {MessageEntryRecord, MessageEntrySchema} from '~services/message-repository/entities';
import {EntrySchema as UserToMessageEntrySchema} from '~services/user-to-message-repository/entities';
import {ServerError} from '~src/types/errors';
import {__tvm_key, __url} from '~src/config';

export class NewsFeedService {
  public generateNewsFeed = async (uid: bigint): Promise<MessageEntryRecord[]> => {
    const uids = await this.getFriends(uid);
    uids.push(uid);
    const messageIds = await this.getMessageIds(uids);
    return await this.getMessagesContent(messageIds);
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

  private async getMessageIds(uids: bigint[]): Promise<bigint[]> {
    const responses: Promise<Response>[] = [];
    for (const uid of uids) {
      responses.push(fetch(`${__url}/api/user-to-message-repository/${uid}`, {
        method: 'GET',
        headers: {
          Authorization: __tvm_key,
        },
      }));
    }
    const messageIds: bigint[] = [];
    for (let i = 0; i < responses.length; ++i) {
      let response = await responses[i];
      if (!response.ok) {
        console.warn(`[NewsFeedService] Error on getting messages of user with id ${uids[i]}: ${response.statusText}`);
        throw new ServerError(`Failed to get messages of user with id ${uids[i]}`);
      }
      const json = await response.json();
      const entry = v.parse(UserToMessageEntrySchema, json);
      messageIds.push(...entry.ids);
    }
    return messageIds;
  }

  private async getMessagesContent(ids: bigint[]): Promise<MessageEntryRecord[]> {
    if (ids.length === 0) {
      return [];
    }

    const query = serialize(ids);
    const response = await fetch(`${__url}/api/message-repository?ids=${query}`, {
      method: 'GET',
      headers: {
        Authorization: __tvm_key,
      },
    });
    if (!response.ok) {
      console.warn(`Error on getting messages content: ${response.statusText}`);
      throw new Error(`Failed to get messages content`);
    }
    const json = await response.json();
    const messages = v.parse(v.array(MessageEntrySchema), json);
    return messages.sort((a, b) =>
        new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime());
  }
}
