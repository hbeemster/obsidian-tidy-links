import {Editor, MarkdownView, Plugin} from 'obsidian';


import {App, Modal, Setting} from 'obsidian';

export class TitleModal extends Modal {
	constructor(app: App, prompt: string, onSubmit: (result: string) => void) {
		super(app);
		// this.setTitle('Tidy Link');

		let result = '';
		new Setting(this.contentEl)
			.setName(prompt)
			.addText((text) =>
				text.onChange((value) => {
					result = value;
					console.log(result);
				}));

		new Setting(this.contentEl)
			.addButton((btn) =>
				btn
					.setButtonText('Submit')
					.setCta()
					.onClick(() => {
						this.close();
						console.log(result);
						onSubmit(result);
					}));
	}
}


export default class TidyLinkPlugin extends Plugin {

	async onload() {
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'tidy-link-command',
			name: 'Tidy Link command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				let title: string;
				let link: string;

				title = editor.getSelection()
				if (title === "") {
					new TitleModal(this.app, "Title", (result) => {
						title = result
						new TitleModal(this.app, "Link", (result) => {
							link = result
							this.processTidyLink(editor, title, link)
						}).open();
					}).open();
				} else {
					new TitleModal(this.app, "Link", (result) => {
						link = result
						this.processTidyLink(editor, title, link)
					}).open();
				}
			}
		});

	}

	// onunload() {
	//
	// }

	async processTidyLink(editor: Editor, title: string, link: string) {
		console.log(`Title: ${title}, link: ${link}`);
		if (isValidUrl(link)){
			const anchor = `[${title}]`
			editor.replaceSelection(anchor)
			const tidylink = `\n${anchor}: ${link}`
			editor.setLine(9999, tidylink);
		} else {
			console.log(`Invalid URL: ${link}`);
		}


	}
}

function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch (error) {
    return false;
  }
}
