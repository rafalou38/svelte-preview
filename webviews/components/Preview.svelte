<script lang="ts">
import { code, vscode } from "./stores";
if (!$code) {
	$vscode?.postMessage({type: "actualize", value:""})
}
</script>

<pre>
	{$code?.js}
</pre>
