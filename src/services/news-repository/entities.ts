import * as v from 'valibot';

import {FullDateSchema, IntegerSchema} from '~src/libraries/parsers/common';

const NEWS_SCHEMA = {
  uid: IntegerSchema('uid'),
  text: v.string('Text must be a string'),
  createdAt: FullDateSchema('createdAt'),
};

export const NewsSchema = v.object({
  ...NEWS_SCHEMA,
});

export const NewsEntrySchema = v.object({
  id: IntegerSchema('id'),
  ...NEWS_SCHEMA,
});

export type NewsRecord = v.Output<typeof NewsSchema>;
export type NewsEntryRecord = v.Output<typeof NewsEntrySchema>;
