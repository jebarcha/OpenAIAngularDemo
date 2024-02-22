import type { TranslateResponse } from '@interfaces/index';
import { environment } from 'environments/environment.development';

export const translateTextUseCase = async (prompt: string, lang: string) => {
  console.log({ prompt });
  try {
    const resp = await fetch(`${environment.backendApi}/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, lang }),
    });

    if (!resp.ok) throw new Error('Cannot do the translation');

    const { message } = (await resp.json()) as TranslateResponse;

    return {
      ok: true,
      message: message,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'Cannot translate..',
    };
  }
};
