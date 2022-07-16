import { App, PluginSettingTab, Setting} from 'obsidian'

import ObsidianPlatzi from 'src/main'
import {FolderSuggest} from './suggesters/FolderSuggester'

const repo = 'https://github.com/moonR2/ObsidianPlatzi'

export enum FrontMatterType {
	snakeCase = 'Snake Case',
	camelCase = 'Camel Case'
}
export interface ObsidianPlatziSettings {
	folder: string;
	fileNameFormat: string;
	frontMatter: string;
	content: string;
	useDefaultFrontMatter: boolean;
	defaultFrontMatterType: FrontMatterType;
}

export const DEFAULT_SETTINGS: ObsidianPlatziSettings = {
	folder: '',
	fileNameFormat: '',
	frontMatter: '',
	content: '',
	useDefaultFrontMatter: true,
	defaultFrontMatterType: FrontMatterType.snakeCase,
}

export class ObsidianPlatziSettingsTab extends PluginSettingTab {
	plugin: ObsidianPlatzi;

	constructor(app: App, plugin: ObsidianPlatzi) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		containerEl.createEl('h2', { text: 'General Settings' });


		new Setting(containerEl)
			.setName('New file location')
			.setDesc('New platzi course notes will be placed here.')
			.addSearch(cb => {
				try {
					new FolderSuggest(this.app, cb.inputEl);
				} catch {
					// eslint-disable
				}
				cb.setPlaceholder('Example: folder1/folder2')
          .setValue(this.plugin.settings.folder)
          .onChange(new_folder => {
            this.plugin.settings.folder = new_folder;
            this.plugin.saveSettings();
          });
			})
		
			containerEl.createEl('h2', { text: 'Frontmatter Settings' });

			new Setting(containerEl)
			.setName('Frontmatter key type')
			.addDropdown((dropDown) => {
				dropDown.addOption(FrontMatterType.snakeCase, FrontMatterType.snakeCase.toString());
				dropDown.addOption(FrontMatterType.camelCase, FrontMatterType.camelCase.toString());
				dropDown.setValue(this.plugin.settings.defaultFrontMatterType)
				dropDown.onChange(async value  => {
					this.plugin.settings.defaultFrontMatterType = value as FrontMatterType;
					await this.plugin.saveSettings();
				});
			});

			new Setting(containerEl)
			.setName('Text to insert into frontmatter')
			.setDesc(createSyntaxesDescription())
			.addTextArea(textArea => {
				const prevOption = this.plugin.settings.frontMatter;
				textArea.setValue(prevOption).onChange(async value => {
					const newOption = value;
					this.plugin.settings.frontMatter = newOption;
					await this.plugin.saveSettings();
				})
			})

			new Setting(containerEl)
			.setName('Text to insert into content')
			.setDesc(createSyntaxesDescription())
			.addTextArea(textArea => {
				const prevOption = this.plugin.settings.content;
				textArea.setValue(prevOption).onChange(async value => {
					const newOption = value;
					this.plugin.settings.content = newOption;
					await this.plugin.saveSettings();
				})
			})
			
			function createSyntaxesDescription(){
				const fragment = document.createDocumentFragment();
				fragment.append(
					'Only the following syntaxes are available: ',
					fragment.createEl('br'),
					fragment.createEl('code', {text: '{{title}}'}),
					fragment.createEl('code', {text: '{{author}}'}),
					fragment.createEl('code', {text: '{{url}}'}),
					fragment.createEl('code', {text: '{{coverUrl}}'}),
					fragment.createEl('code', {text: '{{status}}'}),
					fragment.createEl('code', {text: '{{rating}}'}),
				)
				return fragment;
			}
	}
}
