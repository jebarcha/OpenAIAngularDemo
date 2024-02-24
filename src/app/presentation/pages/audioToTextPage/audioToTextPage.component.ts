import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ChatMessageComponent,
  MyMessageComponent,
  TypingLoaderComponent,
  TextMessageBoxFileComponent,
  TextMessageEvent,
} from '@components/index';
import { AudiotoTextResponse } from '@interfaces/audio-text.response';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from 'app/presentation/services/openai.service';

@Component({
  selector: 'app-audio-to-text-page',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ChatMessageComponent,
    MyMessageComponent,
    TypingLoaderComponent,
    TextMessageBoxFileComponent,
  ],
  templateUrl: './audioToTextPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AudioToTextPageComponent {
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  handleMessageWithFile({ prompt, file }: TextMessageEvent) {
    const text = prompt ?? file.name ?? 'Transcript audio';
    this.isLoading.set(true);

    this.messages.update((prev) => [...prev, { isGpt: false, text: text }]);

    this.openAiService
      .audioToText(file, text)
      .subscribe((resp) => this.handleResponse(resp));
  }

  handleResponse(resp: AudiotoTextResponse | null) {
    this.isLoading.set(false);
    if (!resp) return;

    const text = `## Transcription:
__Duration:__${Math.round(resp.duration)} seconds.

## The text is:
${resp.text}
    `;

    this.messages.update((prev) => [...prev, { isGpt: true, text: text }]);

    for (const segment of resp.segments) {
      const segmentMessage = `
__From ${Math.round(segment.start)} to ${Math.round(segment.end)} seconds.__
${segment.text}
      `;

      this.messages.update((prev) => [
        ...prev,
        { isGpt: true, text: segmentMessage },
      ]);
    }
  }
}
