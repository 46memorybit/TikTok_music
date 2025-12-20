const puppeteer = require("puppeteer");
const { Client } = require("@notionhq/client");

const TARGET_URL =
  "https://www.tiktok.com/music/Unhappy-birthday構文-7558119317473675265?is_from_webapp=1&sender_device=pc";

(async () => {
  // ===== Puppeteer 起動 =====
  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
    headless: "new",
  });

  const page = await browser.newPage();

  // TikTok 対策：User-Agent
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36"
  );

  await page.goto(TARGET_URL, {
    waitUntil: "networkidle2",
    timeout: 60000,
  });

  // 要素が出現するまで待つ
  await page.waitForSelector(
    'h2[data-e2e="music-video-count"]',
    { timeout: 60000 }
  );

  // 中身が空でなくなるまで待つ（重要）
  await page.waitForFunction(() => {
    const el = document.querySelector('h2[data-e2e="music-video-count"]');
    return el && el.innerText && el.innerText.trim().length > 0;
  }, { timeout: 60000 });

  // テキスト取得（例: "750 videos"）
  const viewText = await page.$eval(
    'h2[data-e2e="music-video-count"]',
    el => el.innerText.trim()
  );

  console.log("取得した表示文字:", viewText);

  await browser.close();

  // ===== "750 videos" → 750 に変換 =====
  const parseVideoCount = text => {
    if (!text) return null;

    const match = text.match(/([\d,.]+)/);
    if (!match) return null;

    return Number(match[1].replace(/,/g, ""));
  };

  const videoCount = parseVideoCount(viewText);

  if (videoCount === null) {
    throw new Error("動画数の数値化に失敗しました: " + viewText);
  }

  // ===== Notion =====
  const notion = new Client({
    auth: process.env.NOTION_TOKEN,
  });

  await notion.pages.create({
    parent: {
      database_id: process.env.NOTION_DATABASE_ID,
    },
    properties: {
      日付: {
        date: { start: new Date().toISOString() },
      },
      使用動画数: {
        number: videoCount,
      },
      URL: {
        url: TARGET_URL,
      },
    },
  });

  console.log("記録完了:", videoCount);
})();
