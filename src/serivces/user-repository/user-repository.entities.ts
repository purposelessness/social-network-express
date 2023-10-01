import {Jsonable, Stringable} from '~src/types/utilities';

export class User implements Stringable, Jsonable {
  private internalMessageIds: Set<bigint> = new Set();

  constructor(
      public readonly id: bigint,
      public name: string,
  ) {
  }

  public get messageIds(): bigint[] {
    return [...this.internalMessageIds];
  }

  public set messageIds(messageIds: bigint[] | Set<bigint>) {
    this.internalMessageIds = new Set(messageIds);
  }

  public addMessageId(messageId: bigint): void {
    this.internalMessageIds.add(messageId);
  }

  public removeMessageId(messageId: bigint): void {
    this.internalMessageIds.delete(messageId);
  }

  public hasMessageId(messageId: bigint): boolean {
    return this.internalMessageIds.has(messageId);
  }

  public static fromJson(json: any): User {
    const user = new User(json.id, json.name);
    user.messageIds = json.messageIds;
    return user;
  }

  public toJson(): any {
    return {
      id: this.id,
      name: this.name,
      messageIds: this.messageIds,
    };
  }

  public toString(): string {
    return JSON.stringify(this.toJson());
  }
}