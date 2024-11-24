import {App, Editor, MarkdownView, Modal, Plugin, Setting} from 'obsidian';


// -----------------------------------------------------------------------
// InputModal
// -----------------------------------------------------------------------
export class InputModal extends Modal {
	constructor(app: App, prompt: string, onSubmit: (result: string) => void) {
		super(app);
		this.setTitle(' ');

		// -----------------------------------------------------------------------
		this.scope.register([], 'Enter', (evt: KeyboardEvent) => {
			if (evt.isComposing) {
				return;
			}
				const actionBtn = document
					.getElementsByClassName('mod-cta')
					.item(0) as HTMLButtonElement | null;
				actionBtn?.click();
		});

		// -----------------------------------------------------------------------
		let result = '';
		new Setting(this.contentEl)
			.setName(prompt)
			.addText((text) =>
				text.onChange((value) => {
					console.log(value);
					result = value;
				}));

		new Setting(this.contentEl)
			.addButton((btn) =>
				btn.setButtonText('Submit')
					.setCta()
					.onClick(() => {
						this.close();
						onSubmit(result);
					}));
	}
}

// -----------------------------------------------------------------------
// TidyLinkPlugin
// -----------------------------------------------------------------------
export default class TidyLinkPlugin extends Plugin {
	// -----------------------------------------------------------------------
	async onload() {
		// This adds an editor command that can perform some operation on the current editor instance
		this.addCommand({
			id: 'tidy-link-command',
			name: 'Tidy Link command',
			editorCallback: (editor: Editor, view: MarkdownView) => {
				let title: string;
				let link: string;

				title = editor.getSelection()
				if (isNonEmptyString(title)) {
					new InputModal(this.app, "Link", (result) => {
						link = result
						this.processTidyLink(editor, title, link)
					}).open();
				} else {
					new InputModal(this.app, "Title", (result) => {
						title = result
						if (isNonEmptyString(title)) {
							new InputModal(this.app, "Link", (result) => {
								link = result
								this.processTidyLink(editor, title, link)
							}).open();
						}
					}).open();
				}
			}
		});
	}

	// -----------------------------------------------------------------------
	async processTidyLink(editor: Editor, title: string, link: string) {
		console.log(`Title: ${title}, link: ${link}`);
		if (isNonEmptyString(title) && isNonEmptyString(link)) {
			const anchor = `[${title}]`
			editor.replaceSelection(anchor)
			const tidylink = `\n${anchor}: ${link}`
			editor.setLine(9999, tidylink);
		} else {
			console.log("Title and/or Link can not be empty");
		}

	}
}
// -----------------------------------------------------------------------
// isNonEmptyString
// -----------------------------------------------------------------------
function isNonEmptyString(str: string): boolean {
    return str.trim().length > 0;
}
