// index.js
import { processAllFiles } from "./load_fast_insert_pool_safe.js";

(async () => {
  try {
    await processAllFiles();
    console.log("All files processed.");
  } catch (e) {
    console.error("Run failed:", e);
    process.exit(1);
  }
})();
