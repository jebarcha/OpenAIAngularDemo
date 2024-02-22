import type { OrthographyResponse } from '@interfaces/orthography.response';
import { environment } from 'environments/environment.development';

export const textToAudioUseCase = async (prompt: string, voice: string) => {
  console.log({ prompt });
  try {
    const resp = await fetch(`${environment.backendApi}/text-to-audio`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt, voice }),
    });

    if (!resp.ok) throw new Error('Cannot generate the audio');

    const audioFile = await resp.blob();
    const audioUrl = URL.createObjectURL(audioFile);

    return {
      ok: true,
      message: prompt,
      audioUrl: audioUrl,
    };
  } catch (error) {
    console.log(error);
    return {
      ok: false,
      message: 'Could not generate the audio',
      audioUrl: '',
    };
  }
};
