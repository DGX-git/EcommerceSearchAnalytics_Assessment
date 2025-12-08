import axios from "axios";
import fs from "fs";

export async function downloadRaw(url, outputPath) {
  const response = await axios.get(url, { responseType: "stream" });
  const writer = fs.createWriteStream(outputPath);
  response.data.pipe(writer);
  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(outputPath));
    writer.on("error", reject);
  });
}
