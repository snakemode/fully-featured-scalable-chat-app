import { CosmosDbMetadataRepository } from "../dataaccess/CosmosDbMetadataRepository";
import { Channel } from "../metadata/Channel";

export class ChannelService {
    private _repo: CosmosDbMetadataRepository;

    public constructor() {
        this._repo = new CosmosDbMetadataRepository();
    }

    public async listChannels(): Promise<string[]> {
        const channels = await this._repo.listAll("Channel");
        return channels.map(c => (c.id));
    }

    public async loadMetadata(channelName: string): Promise<Channel> {
        const channel = await this._repo.getById<Channel>("Channel", channelName);
        return channel;
    }
}  