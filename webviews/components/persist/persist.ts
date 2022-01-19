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
      variables.set(target.filter((v) => typeof v !== "function"));
      return true;
    },
  });

  console.log(ctx);

  variables.set(ctx.filter((v) => typeof v !== "function"));
}
