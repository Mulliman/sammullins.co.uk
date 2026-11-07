// Local Netlify build plugin (ticket 806): keeps Astro's generated images between deploys.
// A cold build generates ~1,500 image variants (~15 min). Netlify's docs don't promise that
// node_modules/.astro survives between builds, so this saves and restores it explicitly with
// Netlify's own cache utility. It is a local file, not an npm package: no new dependency.
const DIR = 'node_modules/.astro';

export const onPreBuild = async ({ utils }) => {
  const restored = await utils.cache.restore(DIR);
  console.log(restored ? `Restored ${DIR} from the build cache.` : `No cached ${DIR}: this build is cold.`);
};

export const onPostBuild = async ({ utils }) => {
  const saved = await utils.cache.save(DIR);
  console.log(saved ? `Saved ${DIR} to the build cache.` : `Nothing to save at ${DIR}.`);
};
