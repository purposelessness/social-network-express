import {Jsonable, Stringable} from "~src/types/utilities";

export interface IUserEntity {
  id?: number;
  name: string;
  email: string;
  birthDate: Date;
}

export class User implements Stringable, Jsonable {
  private internalMessageIds: Set<number> = new Set();

  constructor(
      public readonly id: number,
      public name: string,
  ) {
  }

  public get messageIds(): number[] {
    return [...this.internalMessageIds];
  }

  public set messageIds(messageIds: number[] | Set<number>) {
    this.internalMessageIds = new Set(messageIds);
  }

  public addMessageId(messageId: number): void {
    this.internalMessageIds.add(messageId);
  }

  public removeMessageId(messageId: number): void {
    this.internalMessageIds.delete(messageId);
  }

  public hasMessageId(messageId: number): boolean {
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