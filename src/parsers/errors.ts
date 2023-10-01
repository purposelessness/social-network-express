import * as v from 'valibot';

export const ExceptionWithCodeSchema = v.object({
  code: v.number('Code must be a string'),
  name: v.string('Name must be a string'),
  message: v.string('Message must be a string'),
  stack: v.string('Stack must be a string'),
});