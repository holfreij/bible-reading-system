// This code is not part of the Vite app. It can be ran stand-alone.
// Please use with caution, as it will create a massive amount of web-calls.

import { promises as fs } from "fs";
import puppeteer from "puppeteer";
import { scrBookData } from "../scripture-utils";
import { BibleTranslation, BibleTranslations } from "../bible-translation";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function extractHashesFromUrls(urls: string[]): string[] {
  return urls
    .map((url) => {
      const match = url.match(/([\da-f]{32})\.mp3/);
      return match ? match[1] : "";
    })
    .filter((hash) => hash !== "");
}

async function extractAudioHashes(
  translation: BibleTranslation
): Promise<void> {
  const readUrls: string[] = scrBookData.flatMap((bookInfo) => {
    const urls: string[] = [];
    for (let chapter = 1; chapter <= bookInfo.chapters; chapter++) {
      urls.push(
        `https://www.bible.com/audio-bible/${translation.bibleNum}/${bookInfo.shortName}.${chapter}.${translation.shortName}`
      );
    }
    return urls;
  });

  const browser = await puppeteer.launch({ headless: true });

  const audioUrls = await Promise.all(
    readUrls.map(async (readUrl, index) => {
      try {
        await delay(index * 1500);

        const page = await browser.newPage();

        await page.goto(readUrl, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });

        const audioUrl = await page.$eval(
          "audio#dataman-audio",
          (audioElement: HTMLAudioElement) => audioElement.src || null
        );

        await page.close();

        console.log("URL found:", audioUrl);

        return audioUrl;
      } catch (error) {
        console.error(`Error processing ${readUrl}:`, error);
        return null;
      }
    })
  );

  await browser.close();

  const realAudioUrls = audioUrls.filter((url) => url !== null);

  const hashes = extractHashesFromUrls(realAudioUrls);

  try {
    const filePath = `./src/utils/audioHashes/${translation.shortName}.ts`;

    const fileContent = `export const ${
      translation.shortName
    }_hashes: string[] = [
      ${hashes.map((hash) => `  "${hash}"`).join(",\n")}
      ];`;

    await fs.writeFile(filePath, fileContent, "utf-8");
    console.log(`Audio hashes written to ${filePath}`);
  } catch (error) {
    console.error("Error writing to file:", error);
  }
}

async function processTranslations() {
  for (const translation of BibleTranslations.filter(
    (translation) => translation.shortName !== "BB"
  )) {
    try {
      await extractAudioHashes(translation);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  delay(5000);
}

processTranslations();
