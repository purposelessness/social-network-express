import path from 'path';
import fs from 'fs';

import * as v from 'valibot';

import {__src_dir} from '~src/config';
import {MessageEntryRecord, MessageEntrySchema, MessageRecord} from './entities';
import {NotFoundError} from '~src/types/errors';
import {checkUserExistence} from '~src/libraries/checkers';
import {json} from 'express';

export class MessageRepository {
  private static readonly SAVE_FILENAME = path.join(__src_dir, 'data', 'message-repository.json');
  private static UNIQUE_ID = 0n;

  private messages: Map<bigint, MessageEntryRecord> = new Map();

  constructor() {
    this.load();
  }

  public getMessages = async (ids: bigint[]): Promise<MessageEntryRecord[]> => {
    const messages: MessageEntryRecord[] = [];
    for (const id of ids) {
      if (this.messages.has(id)) {
        messages.push(this.messages.get(id)!);
      }
    }
    return messages;
  };

  public getMessage = async (id: bigint): Promise<MessageEntryRecord> => {
    if (!this.messages.has(id)) {
      throw new NotFoundError(`Message with id ${id} does not exist in message repository`);
    }
    return this.messages.get(id)!;
  };

  public doesMessageExist = async (id: bigint): Promise<boolean> => {
    return this.messages.has(id);
  };

  public addMessage = async (message: MessageRecord): Promise<bigint> => {
    await checkUserExistence(message.uid);

    const id = MessageRepository.UNIQUE_ID++;
    this.messages.set(id, {
      id: id,
      uid: message.uid,
      text: message.text,
      createdAt: message.createdAt,
    });
    return id;
  };

  public deleteMessage = async (id: bigint): Promise<void> => {
    if (!this.messages.has(id)) {
      throw new NotFoundError(`Message with id ${id} does not exist in message repository`);
    }
    this.messages.delete(id);
  };

  private load() {
    if (!fs.existsSync(MessageRepository.SAVE_FILENAME)) {
      console.log(`[MessageRepository] File ${MessageRepository.SAVE_FILENAME} does not exist`);
      return;
    }
    let data = fs.readFileSync(MessageRepository.SAVE_FILENAME, 'utf8');
    let messages: MessageEntryRecord[];
    try {
      messages = v.parse(v.array(MessageEntrySchema), JSON.parse(data));
    } catch (e) {
      console.warn(`[MessageRepository] Failed to parse message data`);
      console.log(e);
      return;
    }
    for (const message of messages) {
      this.messages.set(message.id, message);
    }
    console.log(`[MessageRepository] Loaded messages from ${MessageRepository.SAVE_FILENAME}`);
  }


  public save = async (): Promise<void> => {
    const json = [];
    for (const message of this.messages.values()) {
      json.push({
        id: message.id.toString(),
        uid: message.uid.toString(),
        text: message.text,
        createdAt: message.createdAt,
      });
    }
    const data = JSON.stringify(json);
    if (!fs.existsSync(path.dirname(MessageRepository.SAVE_FILENAME))) {
      fs.mkdirSync(path.dirname(MessageRepository.SAVE_FILENAME));
      console.log(`[MessageRepository] Created directory ${path.dirname(MessageRepository.SAVE_FILENAME)}`);
    }
    fs.writeFile(MessageRepository.SAVE_FILENAME, data, (err) => {
      if (err) {
        console.warn(`[MessageRepository] Failed to save messages to ${MessageRepository.SAVE_FILENAME}`);
        throw err;
      }
      console.log(`[MessageRepository] Saved messages to ${MessageRepository.SAVE_FILENAME}`);
    });
  };
}