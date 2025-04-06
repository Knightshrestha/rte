<script lang="ts">
	import Editor from '$lib/components/RTE.svelte';
	let description = $state('');
</script>

<fieldset class="fieldset">
	<legend class="fieldset-legend input-lg text-lg">Rich text editor</legend>
	<Editor
		initialValue={description}
		onChange={(data: string) => {
			description = data;
		}}
	/>
</fieldset>
