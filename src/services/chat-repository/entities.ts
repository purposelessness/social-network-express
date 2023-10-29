import * as v from 'valibot';

import {FullDateSchema, IntegerSchema} from '~src/libraries/parsers/common';

export const BaseMessageSchema = v.object({
  chatId: IntegerSchema('chatId'),
  authorId: IntegerSchema('authorId'),
  text: v.string('text'),
  date: FullDateSchema('date'),
});

export type BaseMessageRecord = v.Output<typeof BaseMessageSchema>;

export const MessageSchema = v.object({
  id: IntegerSchema('id'),
  chatId: IntegerSchema('chatId'),
  authorId: IntegerSchema('authorId'),
  text: v.string('text'),
  date: FullDateSchema('date'),
});

export type MessageRecord = v.Output<typeof MessageSchema>;

export const BaseChatSchema = v.object({
  members: v.array(IntegerSchema('members')),
});

export type BaseChatRecord = v.Output<typeof BaseChatSchema>;

export const ChatSchema = v.object({
  id: IntegerSchema('id'),
  members: v.set(IntegerSchema('members')),
  messages: v.array(MessageSchema, 'messages'),
});

export type ChatRecord = v.Output<typeof ChatSchema>;
