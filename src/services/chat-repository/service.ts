import path from 'path';
import fs from 'fs';

import * as v from 'valibot';

import {__data_dir} from '~src/config';
import {BaseChatRecord, BaseMessageRecord, ChatRecord, ChatSchema} from './entities';
import {NotFoundError} from '~src/types/errors';
import {checkUserExistence} from '~src/libraries/checkers';
import serialize from '~src/libraries/parsers/converter';

export class ChatRepository {
  private static readonly SAVE_FILENAME = path.join(__data_dir, 'chat-repository.json');
  private static UNIQUE_CHAT_ID = 0n;

  private chats: Map<bigint, ChatRecord> = new Map();

  constructor() {
    this.load();
  }

  public getChats = async (ids: bigint[]): Promise<ChatRecord[]> => {
    const chats: ChatRecord[] = [];
    for (const id of ids) {
      if (this.chats.has(id)) {
        chats.push(this.chats.get(id)!);
      }
    }
    return chats;
  };

  public getUserChats = async (uid: bigint): Promise<ChatRecord[]> => {
    const chats: ChatRecord[] = [];
    for (const chat of this.chats.values()) {
      if (chat.members.has(uid)) {
        chats.push(chat);
      }
    }
    return chats;
  };

  public doesChatExist = async (id: bigint): Promise<boolean> => {
    return this.chats.has(id);
  };

  public addChat = async (chat: BaseChatRecord): Promise<bigint> => {
    for (const uid of chat.members) {
      await checkUserExistence(uid);
    }

    const id = ChatRepository.UNIQUE_CHAT_ID++;
    this.chats.set(id, {
      id: id,
      members: new Set(chat.members),
      messages: [],
    });
    return id;
  };

  public deleteChat = async (id: bigint): Promise<void> => {
    if (!this.chats.has(id)) {
      throw new NotFoundError(`Chat with id ${id} does not exist in chat repository`);
    }
    this.chats.delete(id);
  };

  public addMessageToChat = async (id: bigint, baseMessage: BaseMessageRecord): Promise<void> => {
    if (!this.chats.has(id)) {
      throw new NotFoundError(`Chat with id ${id} does not exist in chat repository`);
    }
    const message = {
      id: BigInt(this.chats.get(id)!.messages.length),
      ...baseMessage,
    };
    this.chats.get(id)!.messages.push(message);
  };

  private load() {
    if (!fs.existsSync(ChatRepository.SAVE_FILENAME)) {
      console.log(`[ChatRepository] File ${ChatRepository.SAVE_FILENAME} does not exist`);
      return;
    }
    let data = fs.readFileSync(ChatRepository.SAVE_FILENAME, 'utf8');
    let chats: ChatRecord[];
    try {
      chats = v.parse(v.array(ChatSchema), JSON.parse(data));
    } catch (e) {
      console.warn(`[ChatRepository] Failed to parse chats data`);
      console.log(e);
      return;
    }
    for (const chat of chats) {
      this.chats.set(chat.id, chat);
    }
    ChatRepository.UNIQUE_CHAT_ID = BigInt(this.chats.size);
    console.log(`[ChatRepository] Loaded chats from ${ChatRepository.SAVE_FILENAME}`);
  }


  public save = async (): Promise<void> => {
    const json = [];
    for (const chat of this.chats.values()) {
      json.push(serialize(chat));
    }
    const data = JSON.stringify(json);
    if (!fs.existsSync(path.dirname(ChatRepository.SAVE_FILENAME))) {
      fs.mkdirSync(path.dirname(ChatRepository.SAVE_FILENAME));
      console.log(`[ChatRepository] Created directory ${path.dirname(ChatRepository.SAVE_FILENAME)}`);
    }
    fs.writeFile(ChatRepository.SAVE_FILENAME, data, (err) => {
      if (err) {
        console.warn(`[ChatRepository] Failed to save chats to ${ChatRepository.SAVE_FILENAME}`);
        throw err;
      }
      console.log(`[ChatRepository] Saved chats to ${ChatRepository.SAVE_FILENAME}`);
    });
  };
}