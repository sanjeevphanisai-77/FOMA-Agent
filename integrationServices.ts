import nodemailer from 'nodemailer';

type IntegrationResult = {
  configured: boolean;
  delivered: boolean;
  status?: number;
  error?: string;
};

async function postJson(endpoint: string | undefined, payload: unknown): Promise<IntegrationResult> {
  if (!endpoint) return { configured: false, delivered: false };

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), Number(process.env.INTEGRATION_TIMEOUT_MS || 8000));
  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.INTEGRATION_API_KEY ? { Authorization: `Bearer ${process.env.INTEGRATION_API_KEY}` } : {}),
      },
      body: JSON.stringify(payload),
      signal: controller.signal,
    });
    return { configured: true, delivered: response.ok, status: response.status };
  } catch (error) {
    return { configured: true, delivered: false, error: error instanceof Error ? error.message : 'Integration request failed' };
  } finally {
    clearTimeout(timeout);
  }
}

export function integrationStatus() {
  return {
    agent17: Boolean(process.env.AGENT17_PROFILER_ENDPOINT),
    agent20: Boolean(process.env.AGENT20_DRAFTING_ENDPOINT),
    agent21: Boolean(process.env.AGENT21_COMPLIANCE_ENDPOINT),
    notificationWebhook: Boolean(process.env.NOTIFICATION_WEBHOOK_URL),
    smtpEmail: Boolean(process.env.SMTP_HOST && process.env.SMTP_USER),
    sourceFeedConfiguration: Boolean(process.env.SOURCE_FEEDS_JSON),
    matching: process.env.MATCHING_ENABLED !== 'false',
    scheduler: Number(process.env.JOB_INTERVAL_MINUTES || 0) > 0,
  };
}

export async function dispatchAgentHandoff(agent: 'agent20' | 'agent21', payload: unknown): Promise<IntegrationResult> {
  const endpoint = agent === 'agent20' ? process.env.AGENT20_DRAFTING_ENDPOINT : process.env.AGENT21_COMPLIANCE_ENDPOINT;
  return postJson(endpoint, { source: 'agent22-funding-monitor', agent, payload, sentAt: new Date().toISOString() });
}

export async function dispatchNotification(payload: unknown): Promise<IntegrationResult> {
  const webhookResult = await postJson(process.env.NOTIFICATION_WEBHOOK_URL, { source: 'agent22-funding-monitor', payload, sentAt: new Date().toISOString() });
  const notification = payload as Record<string, unknown>;
  const recipient = String(notification.facultyEmail || notification.email || notification.to || '');
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !recipient) return webhookResult;

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 587),
      secure: process.env.SMTP_SECURE === 'true',
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASSWORD },
    });
    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipient,
      subject: String(notification.callTitle || 'Agent 22 funding notification'),
      text: String(notification.messageBody || 'You have a new funding opportunity notification.'),
    });
    return { configured: true, delivered: true, status: 200 };
  } catch (error) {
    return webhookResult.delivered ? webhookResult : { configured: true, delivered: false, error: error instanceof Error ? error.message : 'SMTP delivery failed' };
  }
}