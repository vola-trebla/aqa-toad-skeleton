import type { Reporter, FullResult, TestCase } from '@playwright/test/reporter';

interface SlackBlock {
  type: string;
  text?: { type: string; text: string };
  fields?: Array<{ type: string; text: string }>;
}

class SlackReporter implements Reporter {
  private readonly seen = new Set<TestCase>();

  onTestEnd(test: TestCase): void {
    this.seen.add(test);
  }

  async onEnd(result: FullResult): Promise<void> {
    const webhook = process.env.SLACK_WEBHOOK;
    if (!webhook) {
      console.log('[slack-reporter] SLACK_WEBHOOK not set, skipping notification.');
      return;
    }

    let passed = 0;
    let failed = 0;
    let flaky = 0;
    let skipped = 0;
    const failures: string[] = [];

    for (const test of this.seen) {
      switch (test.outcome()) {
        case 'expected':
          passed++;
          break;
        case 'flaky':
          flaky++;
          break;
        case 'unexpected':
          failed++;
          failures.push(`❌ ${test.parent.title} > ${test.title}`);
          break;
        case 'skipped':
          skipped++;
          break;
      }
    }

    const emoji = failed === 0 ? '✅' : '🔴';
    const status = failed === 0 ? 'PASSED' : 'FAILED';
    const runLink = this.buildGithubRunLink();

    const blocks: SlackBlock[] = [
      {
        type: 'header',
        text: { type: 'plain_text', text: `${emoji} Test Run ${status}` },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Passed:* ${passed}` },
          { type: 'mrkdwn', text: `*Failed:* ${failed}` },
          { type: 'mrkdwn', text: `*Flaky:* ${flaky}` },
          { type: 'mrkdwn', text: `*Skipped:* ${skipped}` },
          { type: 'mrkdwn', text: `*Duration:* ${Math.round(result.duration / 1000)}s` },
        ],
      },
    ];

    if (runLink) {
      blocks.push({
        type: 'section',
        text: { type: 'mrkdwn', text: `*Run:* <${runLink}|View on GitHub Actions>` },
      });
    }

    if (failures.length > 0) {
      blocks.push({
        type: 'section',
        text: {
          type: 'mrkdwn',
          text: `*Failures (first 10):*\n${failures.slice(0, 10).join('\n')}`,
        },
      });
    }

    try {
      await fetch(webhook, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blocks }),
      });
    } catch (error) {
      console.error('[slack-reporter] Failed to send notification:', error);
    }
  }

  private buildGithubRunLink(): string | null {
    const { GITHUB_SERVER_URL, GITHUB_REPOSITORY, GITHUB_RUN_ID } = process.env;
    if (!GITHUB_SERVER_URL || !GITHUB_REPOSITORY || !GITHUB_RUN_ID) return null;
    return `${GITHUB_SERVER_URL}/${GITHUB_REPOSITORY}/actions/runs/${GITHUB_RUN_ID}`;
  }
}

export default SlackReporter;
