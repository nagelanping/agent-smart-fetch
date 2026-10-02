import type { FetchDependencies } from "./types";

let dependenciesPromise: Promise<FetchDependencies> | undefined;

export function loadRuntimeDependencies(): Promise<FetchDependencies> {
  dependenciesPromise ??= Promise.all([
    import("defuddle/node"),
    import("wreq-js"),
  ]).then(([{ Defuddle }, { fetch, getProfiles }]) => ({
    fetch,
    defuddle: Defuddle,
    getProfiles,
  }));
  return dependenciesPromise;
}
