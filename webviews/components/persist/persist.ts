import type { SvelteComponent } from "svelte/internal";
import { writable } from "svelte/store";
export const variables = writable<unknown[]>([]);

export function updateVariables(iframe: HTMLIFrameElement | null): void {
  if (!iframe) return;

  const rootComponent: SvelteComponent =
    iframe.contentWindow?.["rootComponent"];

  const ctx: unknown[] = rootComponent.$$.ctx;

  rootComponent.$$.ctx = new Proxy(ctx, {
    set: function (target, key, value) {
      target[key] = value;
      variables.set(target.slice(0, -1));
      return true;
    },
  });

  variables.set(ctx.slice(0, -1));
}
