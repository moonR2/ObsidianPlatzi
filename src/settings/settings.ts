import { App, PluginSettingTab, Setting} from 'obsidian'

import ObsidianPlatzi from 'src/main'
import {FolderSuggest} from './suggesters/FolderSuggester'

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
			
	}
}
