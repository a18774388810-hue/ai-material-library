# AI 素材库

**在线地址（任何人可打开）：https://a18774388810-hue.github.io/ai-material-library/**

蝉妈妈·创意「AI素材库」的高赞素材看板，按 26 个类目分区展示，点卡片即可播放。

## 数据现状（2026-11-14 采集）

- **705 条素材 / 26 个类目**
- 采集口径：按点赞数降序，每个类目取前 30 条
- 23 个类目满 30 条；二手商品 11、原料包装 3、奢侈品 1 —— 这三类在蝉妈妈库里本身就这么点素材（`total_page=1`，翻不到第 2 页）

## 页面结构（按类目分区）

```
顶栏：统计 + 搜索 + 类目内排序
类目导航（sticky）：全部 705 / 服饰内衣 30 / 鞋靴箱包 30 …（点击平滑跳转，滚动自动高亮）
主体：26 个类目区块，每块 = 标题（类目名 + 条数 + 最高赞/均赞）+ 30 张卡片
```

- 卡片：9:16 真实封面，底部 点赞 / 评论 / 收藏
- 点击卡片 → 弹层嵌入抖音官方播放器，右侧显示完整指标
- 类目标题可点击折叠；搜索时自动隐藏空类目
- 键盘：`Esc` 关闭，`←` `→` 上一条/下一条

## 文件结构

```
ai-material-library/
├── index.html               页面（样式+交互）
├── data.js                  素材数据（705 条，507KB）
├── raw_materials.json       原始采集数据（完整字段）
├── dist/                    部署产物（index.html + data.js + README）
└── scripts/
    ├── crawl.py             采集：按点赞排序逐品类抓蝉妈妈
    ├── fetch_more.py        补抓：给不足 30 条的品类翻第 2 页
    ├── build_data.py        raw_materials.json → data.js
    └── publish.py           发布到 GitHub Pages
```

## 更新数据

蝉妈妈登录态在 `127.0.0.1:9299` 的 Chrome 里，会过期。过期先重登，然后：

```bash
cd /Users/HUAWEI/WorkBuddy/选题/ai-material-library

# 1. 采集（全量 26 类，约 90 秒，用后台模式跑）
rm -f raw_materials.json
/Users/HUAWEI/.workbuddy/binaries/python/envs/default/bin/python scripts/crawl.py

# 2. 补齐不足 30 条的类目（可选）
/Users/HUAWEI/.workbuddy/binaries/python/envs/default/bin/python scripts/fetch_more.py "礼品文创,生鲜蔬果"

# 3. 生成数据
/Users/HUAWEI/.workbuddy/binaries/python/envs/default/bin/python scripts/build_data.py

# 4. 发布
cp index.html data.js dist/ && /Users/HUAWEI/.workbuddy/binaries/python/envs/default/bin/python scripts/publish.py
```

## 采集原理

`/v1/live/search` 的请求体和响应体都是加密的，无法直接构造请求。但前端解密后一定走 `JSON.parse`，所以在页面里 hook 它就能拿到明文：

```js
var o = JSON.parse;
JSON.parse = function(s, r){
  var v = o(s, r);
  if (v && Array.isArray(v.list)) window.__cap.push(v);
  return v;
};
```

然后切品类 / 翻页触发请求，从 `window.__cap` 取数据。

## 为什么没有「转发数」

蝉妈妈 AI 素材库的互动字段只有 `digg_count`（赞）/ `comment_count`（评）/ `collect_count`（藏），**没有 share_count**。页面因此展示 赞 / 评 / 藏，并在弹层补充 预估播放、跑量分、赞播比。

## 视频为什么不落地

点开卡片时，蝉妈妈嵌的是 `open.douyin.com/player/video?vid=<video_id>` 的抖音播放器，CDN 上只有封面没有 mp4。该 embed 无 X-Frame-Options / CSP 限制，所以页面直接 iframe 嵌入——零下载、705 条全可播。

封面走 `cdn-dy-ad.chanmama.com`，实测无防盗链。

## 部署说明

GitHub Pages（`main` 分支根目录），仓库 `a18774388810-hue/ai-material-library`。
WorkBuddy 云 Studio 也能部署，但当前平台要求分享链接带 `sharecode`，工具返回的链接对外不可直接访问，因此改用 GitHub Pages。
