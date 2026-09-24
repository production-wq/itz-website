import 'server-only';

/**
 * Slack notifications via an Incoming Webhook — no Slack app, no OAuth, no
 * third-party automation tool. Create one at
 * https://api.slack.com/apps → your app → Incoming Webhooks → Add New
 * Webhook to Workspace, pick the channel, then set the URL it gives you as
 * SLACK_WEBHOOK_URL. Never throws: a notification failure should never fail
 * the request that triggered it.
 */

export const isSlackConfigured = () => Boolean(process.env.SLACK_WEBHOOK_URL);

export async function sendSlackMessage(text: string): Promise<void> {
  const url = process.env.SLACK_WEBHOOK_URL;
  if (!url) {
    console.warn(`[slack] SLACK_WEBHOOK_URL not set — skipping notification: ${text.slice(0, 80)}`);
    return;
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
      signal: AbortSignal.timeout(10_000),
    });
    if (!res.ok) {
      console.error(`[slack] webhook responded ${res.status}: ${await res.text().catch(() => '')}`);
    }
  } catch (err) {
    console.error(`[slack] send failed: ${err instanceof Error ? err.message : 'unknown error'}`);
  }
}
