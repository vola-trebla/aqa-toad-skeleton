export async function retryAction<T>(
  action: () => Promise<T>,
  options: {
    maxRetries?: number;
    delayMs?: number;
    description?: string;
  } = {}
): Promise<T> {
  const { maxRetries = 3, delayMs = 1000, description = 'action' } = options;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await action();
    } catch (error) {
      if (attempt === maxRetries) {
        throw new Error(`${description} failed after ${maxRetries} attempts: ${error}`);
      }
      console.log(
        `${description} — attempt ${attempt}/${maxRetries} failed, retrying in ${delayMs}ms...`
      );
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  throw new Error('Unreachable');
}
