import "../startup";
import { Context, HttpRequest } from "@azure/functions";
import { authorized } from "../common/ApiRequestContext";
import { ChannelService } from "../common/services/ChannelService";

type ChannelSummary = { name: string };
type ChannelListResponse = { channels: ChannelSummary[] };

export default async function (context: Context, req: HttpRequest): Promise<void> {
  await authorized(context, req, async () => {

    const service = new ChannelService();
    const channels = await service.listChannels();

    const response: ChannelListResponse = {
      channels: channels.map(name => ({ name: name }))
    };

    context.res = { status: 200, body: JSON.stringify(response) };
  });
}
