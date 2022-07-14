import { App, ButtonComponent, Modal, Setting, TextComponent } from 'obsidian';
import { Course } from './models/courseModel';
import { getByUrl } from './utils/scrapper';

export class UrlModal extends Modal {
  query: string;
  isBusy: boolean;
  okBtn: ButtonComponent;
  onSubmit: (err: Error, result?: Course) => void;

  constructor(app: App, onSubmit?: (err: Error, result?: Course) => void) {
    super(app);
    this.onSubmit = onSubmit;
  }

  async searchCourse() {
    if (!this.query) {
      throw new Error('No url entered');
    }

    if (!this.isBusy) {
      try {
        this.isBusy = true;
        this.okBtn.setDisabled(false);
        this.okBtn.setButtonText('Searching...');
        const searchResult = await getByUrl(this.query);
        this.onSubmit(null, searchResult);
      } catch (err) {
        this.onSubmit(err);
      } finally {
        this.close();
      }
    }
  }

  submitEnterCallback(e: KeyboardEvent) {
    if (e.key === 'Enter') {
      this.searchCourse();
    }
  }

  onOpen(): void {
    const { contentEl } = this;

    contentEl.createEl('h2', { text: 'Enter the url of the course' });

    const placeholder = 'example: https://platzi.com/cursos/discretas/';
    const textComponent = new TextComponent(contentEl);
    textComponent.inputEl.style.width = '100%';
    textComponent
      .setPlaceholder(placeholder ?? '')
      .onChange(text => this.query = text)
      .inputEl.addEventListener('keydown', this.submitEnterCallback.bind(this));
    contentEl.appendChild(textComponent.inputEl);

    new Setting(contentEl)
      .addButton(btn => btn.setButtonText('Cancel').onClick(() => this.close()))
      .addButton(btn => {
        return (this.okBtn = btn.setButtonText('Ok').setCta().onClick(() => {
          console.log("button ok have been pressed")
          this.searchCourse();
        }))

      })

  }

  onClose() {
    const { contentEl } = this;
    contentEl.empty();
  }
}
