import type { ProsConsResponse } from '@interfaces/pros-cons.response';
import { environment } from 'environments/environment.development';

export const prosConsUseCase = async (prompt: string) => {
  //console.log({ prompt });
  try {
    const resp = await fetch(`${environment.backendApi}/pros-cons-discusser`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!resp.ok) throw new Error('Cannot do the comparison');

    const data = (await resp.json()) as ProsConsResponse;

    return {
      ok: true,
      ...data,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      role: '',
      content: 'Cannot do the comparison..',
    };
  }
};
