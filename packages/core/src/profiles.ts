import { DEFAULT_BROWSER } from "./constants";

/** Get the latest Chrome profile available in wreq-js. */
export function getLatestChromeProfile(
  listProfiles: () => string[],
): string {
  const chromes = listProfiles()
    .filter((profile) => profile.startsWith("chrome_"))
    .sort();

  return chromes[chromes.length - 1] ?? DEFAULT_BROWSER;
}
