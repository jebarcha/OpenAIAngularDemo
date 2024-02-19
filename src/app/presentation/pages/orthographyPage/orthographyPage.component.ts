import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
} from '@angular/core';
import {
  ChatMessageComponent,
  GptMessageOrthographyComponent,
  MyMessageComponent,
  TextMessageBoxComponent,
  TextMessageBoxEvent,
  TextMessageBoxFileComponent,
  TextMessageBoxSelectComponent,
  TextMessageEvent,
  TypingLoaderComponent,
} from '@components/index';
import { Message } from '@interfaces/message.interface';
import { OpenAiService } from '../../services/openai.service';

@Component({
  selector: 'app-orthography-page',
  standalone: true,
  imports: [
    CommonModule,
    ChatMessageComponent,
    GptMessageOrthographyComponent,
    MyMessageComponent,

    TypingLoaderComponent,
    TextMessageBoxComponent,
    TextMessageBoxFileComponent,
    TextMessageBoxSelectComponent,
  ],
  templateUrl: './orthographyPage.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class OrthographyPageComponent {
  //public messages = signal<Message[]>([{ text: 'Hello World', isGpt: false }]);
  public messages = signal<Message[]>([]);
  public isLoading = signal(false);
  public openAiService = inject(OpenAiService);

  handleMessage(prompt: string) {
    //console.log([{ prompt }]);
    this.isLoading.set(true);

    this.messages.update((prev) => [
      ...prev,
      {
        isGpt: false,
        text: prompt,
      },
    ]);

    this.openAiService.checkOrthography(prompt).subscribe((resp) => {
      this.isLoading.set(false);
      //console.log(resp);
      this.messages.update((prev) => [
        ...prev,
        {
          isGpt: true,
          text: resp.message,
          info: resp,
        },
      ]);
    });
  }
}
