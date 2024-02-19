import { environment } from 'environments/environment';

export async function* prosConsStreamUserCase(
  prompt: string,
  abortSignal: AbortSignal
) {
  try {
    const resp = await fetch(
      `${environment.backendApi}/pros-cons-discusser-stream`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
        signal: abortSignal,
      }
    );

    if (!resp.ok) throw new Error('Cannot do the comparison');

    const reader = resp.body?.getReader();
    if (!reader) {
      console.log('could not generate the Reader');
      throw new Error('could not generate the Reader');
    }

    const decoder = new TextDecoder();
    let text = '';

    while (true) {
      const { value, done } = await reader.read();
      if (done) {
        break;
      }

      const decodedChunck = decoder.decode(value, { stream: true });
      text += decodedChunck;
      yield text;
    }

    return text;
  } catch (error) {
    return null;
  }
}
