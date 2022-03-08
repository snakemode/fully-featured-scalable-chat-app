import { Entity } from "../dataaccess/IMetadataRepository";

export interface IChannel extends Entity {
  id: string;
}

export class Channel implements IChannel, Entity {
  public id: string;
  public readonly type: string;

  public name: string;
  public members: string[]

  public createdBy: string;
  public description: string;

  public visibility: string;
  public isDefault: true;

  constructor(channelName: string) {
    this.id = channelName;
    this.name = channelName;
    this.type = "Channel";
  }
}
