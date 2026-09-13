export type ScheduledJob = () => Promise<void>;

export function startScheduler(job: ScheduledJob): { enabled: boolean; stop: () => void } {
  const intervalMinutes = Number(process.env.JOB_INTERVAL_MINUTES || 0);
  if (!Number.isFinite(intervalMinutes) || intervalMinutes <= 0) return { enabled: false, stop: () => undefined };

  const interval = setInterval(() => {
    void job().catch(error => console.error('[Agent 22] Scheduled job failed:', error));
  }, intervalMinutes * 60 * 1000);
  return { enabled: true, stop: () => clearInterval(interval) };
}