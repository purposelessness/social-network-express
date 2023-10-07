import * as v from 'valibot';

import {IntegerSchema} from '~src/libraries/parsers/common';

export const EntrySchema = v.object({
  uid: IntegerSchema('uid'),
  ids: v.array(IntegerSchema('messageId')),
});

export const RequestSchema = v.object({
  uid: IntegerSchema('uid'),
  messageId: IntegerSchema('messageId'),
});

export type Entry = v.Output<typeof EntrySchema>;
export type Request = v.Output<typeof RequestSchema>;