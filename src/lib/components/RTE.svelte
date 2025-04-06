<script lang="ts">
	import './rte.css';
	import { onDestroy, onMount } from 'svelte';
	import type { Readable } from 'svelte/store';
	import { createEditor, Editor, EditorContent } from 'svelte-tiptap';
	import DOMPurify from 'isomorphic-dompurify';
	import StarterKit from '@tiptap/starter-kit';
	import Link from '@tiptap/extension-link';
	import CharacterCount from '@tiptap/extension-character-count';

	let {
		initialValue,
		onChange
	}: {
		initialValue: string;
		onChange: (data: string) => void;
	} = $props();

	import Placeholder from '@tiptap/extension-placeholder';

	const extensions = [
		StarterKit.configure({
			history: false
		}),
		Link.configure({
			openOnClick: false,
			autolink: true
		}),
		CharacterCount,
		Placeholder.configure({
			placeholder({ node }) {
				if (node.type.name === 'heading') return 'Heading...';

				return 'Write Something...';
			}
		})
	];

	let editor = $state() as Readable<Editor>;

	onMount(() => {
		editor = createEditor({
			extensions,
			content: DOMPurify.sanitize(initialValue),
			editorProps: {
				attributes: {
					class:
						'bg-base-200 sth_cust !p-2 h-full border-black border-1 border-l-2 border-b-2 outline-none w-full'
				}
			},
			onUpdate: (props) => {
				onChange(DOMPurify.sanitize(props.editor.getHTML()));
			},
			onDestroy: () => {},
			onBlur: () => {
				return;
			}
		});

		return () => {
			if (editor && !$editor.isDestroyed) return;
			$editor.destroy();
		};
	});

	// onDestroy(() => {
	// 	if (editor && !$editor.isDestroyed) return;
	// 	$editor.destroy();
	// });

	let url = $state('');

	const openModal = () => {
		url = $editor.getAttributes('link').href;

		modal.showModal();
	};

	const setLink = () => {
		// cancelled
		if (url === null) {
			return;
		}

		// empty
		if (url === '') {
			$editor.chain().focus().extendMarkRange('link').unsetLink().run();

			return;
		}

		try {
			$editor
				.chain()
				.focus()
				.extendMarkRange('link')
				.setLink({
					href: url,
					target: '_blank',
					rel: 'noreferrer noopener'
				})
				.run();
		} catch (_error) {}
	};

	const isActive = (name: string, attrs = {}) => $editor.isActive(name, attrs);

	let modal: HTMLDialogElement;
</script>

<div class={`prose grid max-w-screen grid-cols-2 grid-rows-[auto_1fr_auto] gap-0`}>
	<div class="flex gap-1 rounded-tl-md border-2 border-r-1 border-b-1 border-black !p-2">
		{#if editor}
			<button
				class={`hover:bg-secondary h-7 rounded-sm p-1 ${
					isActive('link') ? 'bg-primary text-primary-content' : ''
				}`}
				onclick={openModal}>Add link (select text before)</button
			>
		{/if}
	</div>

	<div class="col-start-1 row-start-2">
		{#if editor}
			<EditorContent editor={$editor} />
		{:else}
			<p>Loading Editor...</p>
		{/if}
	</div>

	<div class="bg-base-200 col-start-1 row-start-3 border-2 border-t-0 border-r-1 border-black !p-2">
		{#if editor}
			{$editor.storage.characterCount.characters()} characters,
			{$editor.storage.characterCount.words()} words
		{:else}
			0 characters, 0 words
		{/if}
	</div>

	<div
		class="col-start-2 row-start-1 rounded-tr-md border-2 border-b-1 border-l-1 border-black !p-2"
	>
		<!-- Preview Tool -->
		Manual
	</div>

	<div
		class="bg-base-200 col-start-2 row-span-2 row-start-2 border-2 border-t-1 border-l-1 border-black !p-2 outline-none"
	>
		<table border="1" class="table-zebra table">
			<thead>
				<tr>
					<th>Shortcut</th>
					<th>Description</th>
				</tr>
			</thead>
			<tbody>
				<tr>
					<td>&gt;</td>
					<td>Transforms into a blockquote.</td>
				</tr>
				<tr>
					<td>* (or -) (or +)</td>
					<td>Converts into a bullet list.</td>
				</tr>
				<tr>
					<td>``` (or ~~~) (or ```language)</td>
					<td>Creates a code block.</td>
				</tr>
				<tr>
					<td># , ## , ### , etc.</td>
					<td>Turns into headings.</td>
				</tr>
				<tr>
					<td>--- or ___</td>
					<td>Inserts a horizontal rule.</td>
				</tr>
				<tr>
					<td>1. , 2. , etc.</td>
					<td>Converts into an ordered list.</td>
				</tr>
				<tr>
					<td>**bold** or __bold__</td>
					<td>Makes text bold.</td>
				</tr>
				<tr>
					<td><code>`inline code`</code></td>
					<td>Formats text as inline code.</td>
				</tr>
				<tr>
					<td>*italic* or _italic_</td>
					<td>Makes text italic.</td>
				</tr>
				<tr>
					<td>~~strikethrough~~</td>
					<td>Applies strikethrough.</td>
				</tr>
			</tbody>
		</table>

		<!-- {@html value} -->
	</div>
</div>

<dialog bind:this={modal} class="modal">
	<div class="modal-box">
		<form
			method="dialog"
			onsubmit={(e) => {
				setLink();
			}}
		>
			<input class="input" bind:value={url} />
			<button
				class="btn btn-sm btn-circle btn-ghost absolute top-2 right-2"
				onclick={() => {
					modal.hidePopover();
				}}>✕</button
			>
			<button class="btn">Add Link</button>
		</form>
	</div>
</dialog>
