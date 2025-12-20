const puppeteer = require("puppeteer");
const { Client } = require("@notionhq/client");

// ===== 対象音源URL（複数OK）=====
const TARGET_URLS = [
  "https://www.tiktok.com/music/Unhappy-birthday構文-7558119317473675265?is_from_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/夏の近道-7194804609653671937?is_from_webapp=1&sender_device=pc",
];

(async () => {
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: "new",
  });

  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  for (const url of TARGET_URLS) {
    const page = await browser.newPage();

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
    );

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // ===== 音源名（title）取得 =====
    const title = await page.title(); // 例: "Unhappy birthday構文 | TikTok"
    const musicTitle = title.replace(" | TikTok", "").trim();

    // ===== 動画数取得 =====
    await page.waitForSelector(
      'h2[data-e2e="music-video-count"]',
      { timeout: 60000 }
    );

    await page.waitForFunction(() => {
      const el = document.querySelector('h2[data-e2e="music-video-count"]');
      return el && el.innerText && el.innerText.trim().length > 0;
    }, { timeout: 60000 });

    const viewText = await page.$eval(
      'h2[data-e2e="music-video-count"]',
      el => el.innerText.trim()
    );

    console.log("取得:", musicTitle, viewText);

    await page.close();

    // ===== "750 videos" → 750 =====
    const parseVideoCount = text => {
      if (!text) return null;
      const match = text.match(/([\d,.]+)/);
      if (!match) return null;
      return Number(match[1].replace(/,/g, ""));
    };

    const videoCount = parseVideoCount(viewText);
    if (videoCount === null) {
      throw new Error("動画数の数値化に失敗: " + viewText);
    }

    // ===== Notion 保存 =====
    await notion.pages.create({
      parent: {
        database_id: process.env.NOTION_DATABASE_ID,
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: musicTitle,
              },
            },
          ],
        },
        日付: {
          date: { start: new Date().toISOString() },
        },
        使用動画数: {
          number: videoCount,
        },
        URL: {
          url,
        },
      },
    });

    console.log("Notion保存完了:", musicTitle, videoCount);
  }

  await browser.close();
})();
