import { App, Editor, MarkdownView, Modal, Notice, Plugin, PluginSettingTab, Setting } from 'obsidian';
import { UrlModal } from './urlModal'
import { Course } from './models/courseModel';

import { ObsidianPlatziSettings, ObsidianPlatziSettingsTab, DEFAULT_SETTINGS } from './settings/settings';

export default class ObsidianPlatzi extends Plugin {
	settings: ObsidianPlatziSettings;

	async onload() {
		await this.loadSettings();

		// This adds a status bar item to the bottom of the app. Does not work on mobile apps.
		const statusBarItemEl = this.addStatusBarItem();
		statusBarItemEl.setText('Status Bar Text');

		// This adds a simple command that can be triggered anywhere
		this.addCommand({
			id: 'open-url-modal',
			name: 'Create a new course note',
			callback: () => this.createNewCourseNote(),
		});

		// This adds a settings tab so the user can configure various aspects of the plugin
		this.addSettingTab(new ObsidianPlatziSettingsTab(this.app, this));
	}
	async createNewCourseNote(): Promise<void> {
		try{
			const course = await this.openUrlModal();
			console.log("BOOK RESULT", course);
		} catch (error) {
			console.warn(error);
		}
	}
	
	async openUrlModal (): Promise<Course> {
		return new Promise((resolve, reject) => {
			new UrlModal(this.app, (error, results) => {
				if (error) {
					console.log("ERROR: ", error);
					return reject(error)}
				resolve(results);
			}).open();
		})
	}
	
	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS);
	}
	
	async saveSettings() {
		// TODO - save settings
	}
}
