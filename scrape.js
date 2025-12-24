const puppeteer = require("puppeteer");
const { Client } = require("@notionhq/client");

// ===== 対象音源URL（複数OK）=====
const TARGET_URLS = [
  "https://www.tiktok.com/music/Unhappy-birthday構文-7558119317473675265?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/I-want-tomorrow-to-come--Naeleck-Remix--7493415540019841041?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ピッカーン-7423677961504000016?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/何歳の頃に戻りたいのか-7331938271423449090?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/自業自得-7374735213518407696?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/I-want-tomorrow-to-come-7416539252047218704?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/承認欲求-7284160734509991938?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/夏の近道-7194804609653671937?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/桜月-7194804608416516097?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Start-over-7242321972683098113?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/UDAGAWA-GENERATION-7461885644337858561?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Addiction-7493371657714305041?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Overture-7120411894589949954?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/BAN-6946070240024102914?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Make-or-Break-7504519784526284801?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/僕たちの-La-vie-en-rose-7289302687698864129?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/摩擦係数-7117851004615264257?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/五月雨よ-7075626632878229506?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/流れ弾-7013593554840717314?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/何度-LOVE-SONGの歌詞を読み返しただろう-7331944374447392770?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/TOKYO-SNOW-7422883733470971905?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Buddies-6898975915112482818?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/なぜ-恋をして来なかったんだろう-6898975912839088129?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Anthem-time-7243630293147961345?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/君と僕と洗濯物-6946070229852096514?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/無言の宇宙-7013593554593449986?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Nobody's-fault-6898975911765379074?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ずっと-春だったらなあ-7120411899086243842?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/静寂の暴力-7243630293147895809?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/櫻坂の詩-6946070231420766209?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ドローン旋回中-7243630293147846657?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/死んだふり-7510123994479314961?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/紋白蝶が確か飛んでた-7467475081490237441?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/僕のジレンマ-7075626631386073089?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/マモリビト-7289302687698831361?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/偶然の答え-6946070232633755650?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ジャマイカビール-7013593554198988802?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/その日まで-7158769523582060546?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/油を注せ-7331944374447409154?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Cool-7194804608773031938?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ブルームーンキス-6898975911136217090?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/最終の地下鉄に乗って-6898975914537781250?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/確信的クロワッサン-7289302687698847745?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/港区パセリ-7512041461368457217?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/隙間風よ-7289302687698913281?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/思ったよりも寂しくない-6946070230921644034?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/引きこもる時間はない-7379541565105539073?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Dead-end-7013593555155290113?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Microscope-6946070237423650818?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Nightmare症候群-7467847536067381265?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Alter-ego-7560565950526572560?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/愛し合いなさい-7379539660161484801?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/もう一曲-欲しいのかい-7379829627604879361?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/制服の人魚-7075626631801112578?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/本質的なこと-7421387422372644865?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/マンホールの蓋の上-7289302687698896897?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/条件反射で泣けて来る-7120411897987336194?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Nothing-special-7467853152496306177?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/僕は僕を好きになれない-7420663058689017857?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/君がサヨナラ言えたって----7311512928343345153?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ソニア-7013593554127685634?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/コンビナート-7243630293147944961?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/I'm-in-7075626631531907074?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/タイムマシーンでYeah-7120411897110726658?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/恋が絶滅する日-7195507163660306433?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/それが愛なのね-6946070229299267585?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/美しきNervous-7013593554644420609?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/On-my-way-7013593554509367298?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/車間距離-7075626632413546497?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Don't-cut-in-line-7289302687698880513?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/君のことを想いながら-7513805326497482769?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/イザベルについて-7379829627604830209?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Plastic-regret-6898975913992521729?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/半信半疑-6898975913367570434?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ULTRAVIOLET-7467475081490155521?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/標識-7379829627604862977?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/縁起担ぎ-7379829627604846593?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/断絶-7075626631666124801?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/One-way-stairs-7120411896893458433?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/青空が見えるまで-7560565950526490640?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/真夏に何か起きるのかしら-7331944374447425538?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/真夏の大統領-7513804903967967249?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/一瞬の馬-7243630293147830273?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ノンアルコール-7513805326497499153?is_fromfrom_webapp=1&sender_device=pc",
  
  "https://www.tiktok.com/music/無念-7194804609017120769?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/木枯らしは泣かない-7560565950526474256?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/I-will-be-7560565950526507024?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/恋愛無双-7513804903967950865?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/もしかしたら真実-7194804609234241538?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/19歳のガレット-7422883733470955521?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/心の影絵-7331944374447441922?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/恋は向いてない-7331944374447458306?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/魂のLiar-7194804609435568129?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/五月雨よ--OFF-VOCAL-ver--7195507163924531201?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/風の音-7243630293147928577?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/静寂の暴力--OFF-VOCAL-ver--7285967346140923905?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/BAN--OFF-VOCAL-Ver--7013594336059197442?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/行かないで-7467475081490253825?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Start-over--OFF-VOCAL-ver--7285967346140907521?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/櫻坂の詩--OFF-VOCAL-Ver--7013594335857870849?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/やるしかないじゃん-7467475081490171905?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/嵐の前世界の終わり-7422883733471053825?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/泣かせて-Hold-me-tight-7331944374447474690?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/今さらSuddenly-7422883733471037441?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/流れ弾--OFF-VOCAL-ver--7078286072869832705?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/偶然の答え--OFF-VOCAL-Ver--7013594335803344898?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/夜空で一番輝いてる星の名前を僕は知らない-7560565950526523408?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/承認欲求--OFF-VOCAL-ver--7332715384644519938?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Interlude-1-7493409744616032273?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/なぜ-恋をして来なかったんだろう--OFF-VOCAL-ver--6946070231262201857?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/静寂の暴力-Seijyaku-no-bouryoku--NURKO-Remix--7493415540019939345?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/マモリビト--OFF-VOCAL-ver--7332715384644536322?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ブルームーンキス--OFF-VOCAL-ver--6946070232309958658?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/承認欲求-Shoninyokkyu--Ninajirachi-Remix--7490478600875526161?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/UDAGAWA-GENERATION--TSAR-Remix--7493409744615868433?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Nobody's-fault--OFF-VOCAL-ver--6946070230120548353?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/何歳の頃に戻りたいのか-Ikutsunokoronimodoritainoka--Raiden-Remix--7493415540020070417?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Buddies-English-Version-7560565950526539792?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/TOKYO-SNOW--OFF-VOCAL-ver--7467475173823580161?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/もう一曲-欲しいのかい--OFF-VOCAL-ver--7423616112775301121?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/恋が絶滅する日--OFF-VOCAL-ver--7195507164415444994?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Dead-end--OFF-VOCAL-ver--7078286073059461122?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/美しきNervous--OFF-VOCAL-ver--7078286073243125761?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Nightmare症候群--OFF-VOCAL-ver--7515010215290439697?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/UDAGAWA-GENERATION--OFF-VOCAL-ver--7515010215290423313?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/自業自得-Jigoujitoku--devin-Remix--7493415540020086801?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Interlude-7-7493415540020119569?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Interlude-4-7493415540020021265?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/I-want-tomorrow-to-come--OFF-VOCAL-ver--7467475173823645697?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/引きこもる時間はない--OFF-VOCAL-ver--7423616112775284737?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Interlude-3-7493409744615917585?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Interlude-6-7493409744615983121?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Interlude-2-7493415540019873809?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/ノンアルコール--OFF-VOCAL-ver--7561682318463158289?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Make-or-Break--OFF-VOCAL-ver--7561682318463125521?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/死んだふり--OFF-VOCAL-ver--7561682318463141905?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/やるしかないじゃん--OFF-VOCAL-ver--7515010215290456081?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/Interlude-5-7493409744615950353?is_fromfrom_webapp=1&sender_device=pc",
  "https://www.tiktok.com/music/本質的なこと--OFF-VOCAL-ver--7467475173823563777?is_fromfrom_webapp=1&sender_device=pc",
  
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

    // ===== 音源名（h1[data-e2e="music-title"]）取得 =====
    await page.waitForSelector(
      'h1[data-e2e="music-title"]',
      { timeout: 60000 }
    );
    
    await page.waitForFunction(() => {
      const el = document.querySelector('h1[data-e2e="music-title"]');
      return el && el.innerText && el.innerText.trim().length > 0;
    }, { timeout: 60000 });
    
    const musicTitle = await page.$eval(
      'h1[data-e2e="music-title"]',
      el => el.innerText.trim()
    );

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
