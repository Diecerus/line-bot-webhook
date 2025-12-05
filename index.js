const express = require("express");
const line = require("@line/bot-sdk");

const config = {
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
  channelSecret: process.env.CHANNEL_SECRET,
};

const client = new line.Client(config);
const app = express();
app.use(express.json());

// Webhook 接收點
app.post("/webhook", (req, res) => {
  Promise.all(req.body.events.map(handleEvent))
    .then(() => res.status(200).end())
    .catch((err) => {
      console.error(err);
      res.status(500).end();
    });
});

// 處理事件
function handleEvent(event) {
  // 新人加入群組事件
  if (event.type === "memberJoined") {
    return client.replyMessage(event.replyToken, {
      type: "image",
      originalContentUrl: process.env.WELCOME_IMAGE,
      previewImageUrl: process.env.WELCOME_IMAGE,
    });
  }

  // 其他事件不處理
  return Promise.resolve(null);
}

// 啟動 Server（Render 會使用 3000 port）
app.listen(3000, () => {
  console.log("LINE Bot webhook is running on port 3000");
});
