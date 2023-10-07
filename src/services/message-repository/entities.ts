import * as v from 'valibot';

import {FullDateSchema, IntegerSchema} from '~src/libraries/parsers/common';

const MESSAGE_SCHEMA = {
  uid: IntegerSchema('uid'),
  text: v.string('Text must be a string'),
  createdAt: FullDateSchema('createdAt'),
};

export const MessageSchema = v.object({
  ...MESSAGE_SCHEMA,
});

export const MessageEntrySchema = v.object({
  id: IntegerSchema('id'),
  ...MESSAGE_SCHEMA,
});

export type MessageRecord = v.Output<typeof MessageSchema>;
export type MessageEntryRecord = v.Output<typeof MessageEntrySchema>;
