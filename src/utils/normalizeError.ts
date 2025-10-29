export function normalizeError(error: any): Error {
  if (error instanceof Error) return error;
  try {
    const serialized = typeof error === 'string' ? error : JSON.stringify(error);
    return new Error(serialized);
  } catch (_e) {
    return new Error('Unknown error');
  }
}


