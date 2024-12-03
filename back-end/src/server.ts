import express from "express";
import cors from "cors";
import puppeteer from "puppeteer";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/scrape-audio-file-url", async (req, res) => {
  const url = req.query.url as string;

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: true,
  });
  const page = await browser.newPage();

  // Navigate to the webpage
  await page.goto(url);

  // Extract the `src` attribute of the <audio> element
  const audioSrc = await page.$eval(
    "audio#dataman-audio",
    (audioElement: HTMLAudioElement) => {
      return audioElement.src || null;
    }
  );

  // Close the browser
  await browser.close();

  console.log("Found audio URL:", audioSrc);

  res.send(audioSrc);
});

app.listen(port, () => {
  return console.log(
    `Bible Reading System back-end is listening at port ${port}`
  );
});
