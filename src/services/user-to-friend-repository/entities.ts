import * as v from 'valibot';

import {IntegerSchema, IntegerSetSchema} from '~src/parsers/common';

const EntrySchema = v.object({
  uid: IntegerSchema('uid'),
  ids: IntegerSetSchema('ids'),
});

export const RequestSchema = v.object({
  uid: IntegerSchema('uid'),
  friendId: IntegerSchema('friendId'),
});

export type Entry = v.Output<typeof EntrySchema>;
export type Request = v.Output<typeof RequestSchema>;