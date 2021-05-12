import { IncomingWebhook } from "@slack/webhook";
import { ConfigProvider } from "./index";

export const sendMessage = async (message: string): Promise<void> => {
  const webhook = new IncomingWebhook(ConfigProvider.setup.slack.webhookUrl);
  await webhook.send(message);
}
