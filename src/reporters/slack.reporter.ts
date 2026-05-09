import type { Reporter, FullResult, TestCase, TestResult } from '@playwright/test/reporter';

class SlackReporter implements Reporter {
  private passed = 0;
  private failed = 0;
  private skipped = 0;
  private failures: string[] = [];

  onTestEnd(test: TestCase, result: TestResult): void {
    switch (result.status) {
      case 'passed':
        this.passed++;
        break;
      case 'failed':
        this.failed++;
        this.failures.push(`❌ ${test.title}`);
        break;
      case 'skipped':
        this.skipped++;
        break;
    }
  }

  async onEnd(result: FullResult): Promise<void> {
    const webhook = process.env.SLACK_WEBHOOK;
    if (!webhook) {
      console.log('Slack webhook not found, skipping notification.');
      return;
    }

    const emoji = this.failed === 0 ? '✅' : '🔴';
    const status = this.failed === 0 ? 'PASSED' : 'FAILED';

    const message = {
      blocks: [
        {
          type: 'header',
          text: {
            type: 'plain_text',
            text: `${emoji} Test Run ${status}`,
          },
        },
        {
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*Passed:* ${this.passed}` },
            { type: 'mrkdwn', text: `*Failed:* ${this.failed}` },
            { type: 'mrkdwn', text: `*Skipped:* ${this.skipped}` },
            { type: 'mrkdwn', text: `*Duration:* ${Math.round(result.duration / 1000)}s` },
          ],
        },
      ],
    };

    if (this.failures.length > 0) {
      message.blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Failures:*\n${this.failures.slice(0, 10).join('\n')}`,
        },
      } as { type: string; text: { type: string; text: string } });
    }

    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(message),
      });
    } catch (error) {
      console.error('Failed to send Slack notification:', error);
    }
  }
}

export default SlackReporter;
