<script lang="ts">
	import Console from './console.svelte'

	let dragging = false;
	let height = 300;
	let current: "console"| "errors"|"infos"  = "console";
	function handleMovement(e:MouseEvent & { currentTarget: EventTarget & HTMLElement; }) {
		if (!dragging) return;
		height = height - e.movementY*1.5;
	}

	$:{
		if (dragging) {
			document.querySelector("html")?.classList.add("dragging")
		} else {
			document.querySelector("html")?.classList.remove("dragging")
		}
	}
</script>

<svelte:body on:mouseout={(e)=>{
	// @ts-ignore
	if(e.toElement === null || e.toElement.tagName == "HTML"){
		dragging = false;
	}
}} on:mousemove={handleMovement} on:mouseup={()=>{dragging = false}}/>


<div class="main"  style={`height: ${height}px`}>
	<div class="handle" class:dragging on:mousedown={()=>{dragging = true}}></div>
	<ul class="tabs">
		<li class="tab" class:active={current == "console"} on:click={()=>current = "console"}>console</li>
		<li class="tab" class:active={current == "errors"} on:click={()=>current = "errors"}>errors</li>
		<li class="tab" class:active={current == "infos"} on:click={()=>current = "infos"}>infos</li>
	</ul>
	{#if current == "console"}
		<Console></Console>
	{:else if  current == "errors"}
		 <!-- else if content here -->
	{:else if  current == "infos"}
		 <!-- else if content here -->
	{/if}
</div>

<style lang="scss">
	.main{
		background: var(--vscode-panel-background);
		border-top: 1px solid var(--vscode-panel-border);
		box-sizing: border-box;
		position: relative;
		display: flex;
		flex-direction: column;
	}
	$handle-height: 6px;
	.handle{
		position: absolute;
		height: $handle-height;
		width: 100%;
		top: -($handle-height/2);
		cursor: n-resize;
		transition: opacity 0.5s ease;
		opacity: 0.0;
		&.dragging,
		&:hover{
			background: var(--vscode-focusBorder);
			opacity: 1;
		}
	}
	ul.tabs{
		display: flex;
    margin: 0 auto;
    padding: 0;
    height: 35px;
    width: 100%;
    align-items: center;
		flex-grow: 0;
		flex-shrink: 0;

		li.tab{
			box-sizing: border-box;
			cursor: pointer;
			margin: 0 10px;
			padding: 4px 10px 3px;
			list-style: none;
			display: grid;
			height: 100%;
			place-items: center;
			background: none;
			border: none;
			text-transform: uppercase;
			color: var(--vscode-panelTitle-inactiveForeground);
			&:hover,
			&:focus,
			&.active{
				color: var(--vscode-panelTitle-activeForeground);
			}
			&.active{
				border-bottom: 1px solid var(--vscode-panelTitle-activeBorder);
			}
		}
	}

</style>
