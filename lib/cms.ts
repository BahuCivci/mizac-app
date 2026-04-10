import { mizacProfiller, sorular, MizacTip, MizacProfil } from './mizac-data';

// ====================================================================================
// DATA ACCESS LAYER (CMS ADAPTER)
//
// This file acts as an adapter for our data source. Currently, it reads from a local
// TypeScript file (`mizac-data.ts`), but it's designed to be easily replaceable.
//
// In the future, we can swap out the logic here to fetch from a real Headless CMS
// (like Strapi, Sanity, Contentful) by changing only this file. The rest of the
// application will not need to be updated.
// ====================================================================================

const apiDelay = 5; // Artificial delay to simulate network latency

/**
 * Fetches all temperament profiles.
 * @returns A promise that resolves to an array of all MizacProfil objects.
 */
export async function getAllMizacProfiles(): Promise<MizacProfil[]> {
  await new Promise(resolve => setTimeout(resolve, apiDelay));
  return Object.values(mizacProfiller);
}

/**
 * Fetches the profile for a single temperament.
 * @param id The ID of the temperament ('safravi', 'demevi', etc.)
 * @returns A promise that resolves to the MizacProfil object or null if not found.
 */
export async function getMizacProfile(id: MizacTip): Promise<MizacProfil | null> {
  await new Promise(resolve => setTimeout(resolve, apiDelay));
  const profile = mizacProfiller[id];
  return profile || null;
}

/**
 * Fetches all available temperament IDs.
 * @returns A promise that resolves to an array of temperament ID strings.
 */
export async function getAllMizacIds(): Promise<string[]> {
  await new Promise(resolve => setTimeout(resolve, apiDelay));
  return Object.keys(mizacProfiller);
}

/**
 * Fetches the list of questions for the temperament test.
 * @returns A promise that resolves to the array of questions.
 */
export async function getQuestions() {
  await new Promise(resolve => setTimeout(resolve, apiDelay));
  return sorular;
}
