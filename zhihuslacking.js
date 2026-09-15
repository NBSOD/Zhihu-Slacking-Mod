// ==UserScript==
// @name         知乎极简沉浸纯净阅读与摸鱼防窥版-个人修改版
// @namespace    https://github.com/NBSOD/Zhihu-Slacking-Mod
// @version      1.0.1
// @description  基于原脚本「知乎极简沉浸 - 纯净阅读与摸鱼防窥版」改写：宽屏自适应(1100px)、仅保留 Esc 老板键。全站去顶栏/侧栏/广告/看山/操作条；彻底消灭丑陋白底骨架屏；回答时间自动置顶；问答页黑底白字平铺；消灭知乎页签图标；评论详情与楼中楼弹窗全黑夜化；顶部极简搜索栏；图片模糊防窥；右侧4浮钮；配备1:1像素级高保真VS Code代码编辑器全屏掩护
// @author       Suepr_FFF, Deepseek-v4-Pro
// @match        https://www.zhihu.com/*
// @match        https://zhuanlan.zhihu.com/*
// @icon         data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23999"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8" fill="%23666"/></svg>
// @license      MIT
// @grant        GM_addStyle
// @run-at       document-start
// @downloadURL https://update.greasyfork.org/scripts/595868/%E7%9F%A5%E4%B9%8E%E6%9E%81%E7%AE%80%E6%B2%89%E6%B5%B8%E7%BA%AF%E5%87%80%E9%98%85%E8%AF%BB%E4%B8%8E%E6%91%B8%E9%B1%BC%E9%98%B2%E7%AA%A5%E7%89%88-%E4%B8%AA%E4%BA%BA%E4%BF%AE%E6%94%B9%E7%89%88.user.js
// @updateURL https://update.greasyfork.org/scripts/595868/%E7%9F%A5%E4%B9%8E%E6%9E%81%E7%AE%80%E6%B2%89%E6%B5%B8%E7%BA%AF%E5%87%80%E9%98%85%E8%AF%BB%E4%B8%8E%E6%91%B8%E9%B1%BC%E9%98%B2%E7%AA%A5%E7%89%88-%E4%B8%AA%E4%BA%BA%E4%BF%AE%E6%94%B9%E7%89%88.meta.js
// ==/UserScript==

/*
 * MIT License
 *
 * 原始脚本 Copyright (c) Yasin Yan (GreasyFork 用户 zhihu-minimal-stealth)
 *   原始地址: https://greasyfork.org/zh-CN/scripts/594124
 *   原始版本: v6.1.1
 *
 * 修改版 Copyright (c) 2026 Suepr_FFF
 *   修改内容: 宽屏自适应(1100px)、精简键盘快捷键仅保留 Esc、重新编排版本号
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

(function () {
  'use strict';

  // 0. 毫秒级防闪白 (Anti-FOUC)：首行同步读取暗黑模式偏好，抢在DOM解析前锁定深色基底
  const savedTheme = localStorage.getItem('zh_theme');
  const isDarkInitial = savedTheme === 'dark' || (!savedTheme && window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches);
  if (isDarkInitial && document.documentElement) {
    document.documentElement.classList.add('zh-dark-mode');
    document.documentElement.style.backgroundColor = '#111316';
  }

  // 1. 注入全站核心 CSS
  const css = `
    /* === 1. 全站隐藏多余干扰元素 === */
    header.AppHeader,
    .AppHeader,
    .AppHeader-profileAvatar,
    .ColumnPageHeader {
      display: none !important;
    }

    .WriteArea.Card,
    .Topstory-mainColumn > div.Card:first-child:has(.css-7cv61t),
    .Topstory-mainColumn > div.Card:has(.Avatar) {
      display: none !important;
    }

    /* 隐藏首页、详情页、专栏及搜索结果页右侧全部边栏 */
    .Topstory-container > div:nth-child(2),
    .GlobalSideBar,
    .Question-sideColumn,
    .QuestionHeader-side,
    .Search-container > div:nth-child(2),
    .SearchSideBar,
    div[class*="SearchSideBar"],
    .Search-container > .css-19jsr79,
    .Post-SideActions,
    .Post-topicsAndReviewer,
    .css-19jsr79,
    .CreatorEntrance,
    .HotSearchCard,
    .KfeCollection-CreateSaltCard,
    footer.css-2pfapc {
      display: none !important;
    }

    /* 隐藏问题头部底部操作条 */
    .QuestionHeader-footer,
    .QuestionHeader-footer-inner,
    .QuestionHeader-footer-main,
    .QuestionButtonGroup,
    .QuestionHeaderActions {
      display: none !important;
      height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
    }

    .CornerButtonsGroup,
    .CornerButtons,
    .CornerAnimayedFlex--kanshan,
    .KanshanCornerButton,
    button[aria-label="看山"] {
      display: none !important;
    }

    /* === 2. 强力屏蔽知乎商业大图广告 === */
    .pc-article-answer-big-img,
    div[class*="pc-article-answer-"],
    .Pc-Business-Card-PcTopFeedBanner,
    .Pc-card,
    .AdvertImg,
    .TopstoryItem--advertCard,
    div[data-za-detail-view-element_name="Ad"] {
      display: none !important;
      height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
    }

    /* === 3. 彻底消灭首屏加载与异步加载时所有丑陋的骨架屏占位 ===
       知乎新版骨架屏为 <section class="skeleton skeleton--t02"> 结构，
       故必须不限标签名且大小写通吃（skeleton/Skeleton），并连同包裹空卡片一起隐藏 */
    [class*="skeleton"]:not(html):not(body),
    [class*="Skeleton"]:not(html):not(body),
    [class*="PlaceHolder"],
    [class*="placeholder"]:not(input):not(textarea):not([class*="DraftEditor"]),
    .QuestionWaiting,
    .TopstoryItem--placeholder,
    div[class*="LoadingBar"],
    .Card:has([class*="skeleton"]),
    .Card:has([class*="Skeleton"]),
    .Card:has([class*="PlaceHolder"]),
    .Card:has([class*="placeholder"]) {
      display: none !important;
      opacity: 0 !important;
      visibility: hidden !important;
      height: 0 !important;
      margin: 0 !important;
      padding: 0 !important;
      overflow: hidden !important;
      pointer-events: none !important;
    }

    /* 信息流封面图自身的浅白加载占位底色 → 暗黑化 */
    html.zh-dark-mode .RichContent-cover,
    html.zh-dark-mode .RichContent-cover-inner,
    html.zh-dark-mode .RichContent-cover img,
    html.zh-dark-mode .RichContent-cover-inner img,
    html.zh-dark-mode img[alt="cover"] {
      background: #191c20 !important;
      background-color: #191c20 !important;
    }

    html.zh-dark-mode .PlaceHolder,
    html.zh-dark-mode .QuestionWaiting,
    html.zh-dark-mode div[class*="PlaceHolder"],
    html.zh-dark-mode div[class*="Skeleton"] {
      background: transparent !important;
      background-color: transparent !important;
      border: none !important;
      box-shadow: none !important;
    }

    /* === 4. 摸鱼专属：消灭社交符号 & 图片毛玻璃防窥 === */
    .Avatar,
    .AuthorInfo-avatarWrapper,
    .AuthorInfo-avatar,
    img.Avatar,
    .UserLink-link > img {
      display: none !important;
    }

    /* 正文配图默认重度模糊，悬停清晰；排除表情贴纸 */
    .RichText img:not([class*="emoji"]):not([class*="sticker"]),
    .RichContent img:not([class*="emoji"]):not([class*="sticker"]),
    .Post-RichTextContainer img:not([class*="emoji"]):not([class*="sticker"]),
    .origin_image,
    .TitleImage,
    figure img {
      filter: blur(14px) brightness(0.7) !important;
      opacity: 0.25 !important;
      transition: all 0.3s ease !important;
      cursor: zoom-in !important;
      max-height: 180px !important;
      object-fit: cover !important;
      border-radius: 6px !important;
    }

    .RichText img:hover,
    .RichContent img:hover,
    .Post-RichTextContainer img:hover,
    .origin_image:hover,
    .TitleImage:hover,
    figure img:hover {
      filter: none !important;
      opacity: 1 !important;
      max-height: unset !important;
    }

    img.sticker,
    img[class*="sticker"],
    img[class*="emoji"] {
      filter: none !important;
      opacity: 1 !important;
      max-height: 22px !important;
      display: inline-block !important;
      vertical-align: text-bottom !important;
    }

    .VoteButton {
      background: transparent !important;
      border: 1px solid rgba(120, 130, 140, 0.2) !important;
      color: inherit !important;
      font-weight: normal !important;
      padding: 4px 10px !important;
      font-size: 13px !important;
      box-shadow: none !important;
    }

    /* === 5. 回答时间自动置顶样式 === */
    .ContentItem-time.zh-hoisted-time {
      font-size: 13px !important;
      line-height: 18px !important;
      margin-top: 3px !important;
      margin-bottom: 2px !important;
      display: block !important;
      user-select: text !important;
    }

    html:not(.zh-dark-mode) .ContentItem-time.zh-hoisted-time,
    html:not(.zh-dark-mode) .ContentItem-time.zh-hoisted-time a {
      color: #8491a5 !important;
    }

    html.zh-dark-mode .ContentItem-time.zh-hoisted-time,
    html.zh-dark-mode .ContentItem-time.zh-hoisted-time a {
      color: #7b8390 !important;
    }

    /* === 6. 顶部自适应极简搜索栏 === */
    #zh-clean-searchbar-wrapper {
      position: sticky !important;
      top: 0 !important;
      z-index: 99999 !important;
      width: 100% !important;
      display: flex !important;
      justify-content: center !important;
      padding: 12px 0 !important;
      backdrop-filter: blur(12px) !important;
      -webkit-backdrop-filter: blur(12px) !important;
    }

    html:not(.zh-dark-mode) #zh-clean-searchbar-wrapper {
      background: rgba(245, 247, 250, 0.85) !important;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05) !important;
    }

    html.zh-dark-mode #zh-clean-searchbar-wrapper {
      background: rgba(17, 19, 22, 0.85) !important;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07) !important;
    }

    .zh-clean-searchbar {
      width: 100% !important;
      max-width: 1100px !important;
      display: flex !important;
      align-items: center !important;
      position: relative !important;
      border-radius: 24px !important;
      box-sizing: border-box !important;
    }

    html:not(.zh-dark-mode) .zh-clean-searchbar {
      background: #ffffff !important;
      border: 1px solid rgba(0, 0, 0, 0.08) !important;
      box-shadow: 0 2px 8px rgba(0, 20, 50, 0.04) !important;
    }

    html.zh-dark-mode .zh-clean-searchbar {
      background: #1a1d21 !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3) !important;
    }

    .zh-clean-searchbar:focus-within {
      border-color: #0066ff !important;
      box-shadow: 0 0 0 3px rgba(0, 102, 255, 0.15) !important;
    }

    .zh-search-icon {
      width: 18px !important;
      height: 18px !important;
      margin-left: 16px !important;
      stroke-width: 2.2 !important;
      stroke-linecap: round !important;
      stroke-linejoin: round !important;
      fill: none !important;
      flex-shrink: 0 !important;
    }

    html:not(.zh-dark-mode) .zh-search-icon { stroke: #8491a5 !important; }
    html.zh-dark-mode .zh-search-icon { stroke: #717b88 !important; }

    #zh-clean-search-input {
      flex: 1 !important;
      height: 40px !important;
      background: transparent !important;
      border: none !important;
      outline: none !important;
      padding: 0 14px !important;
      font-size: 14.5px !important;
      font-family: inherit !important;
      box-sizing: border-box !important;
    }

    html:not(.zh-dark-mode) #zh-clean-search-input { color: #2c323b !important; }
    html:not(.zh-dark-mode) #zh-clean-search-input::placeholder { color: #9ba4b0 !important; }
    html.zh-dark-mode #zh-clean-search-input { color: #e4e7eb !important; }
    html.zh-dark-mode #zh-clean-search-input::placeholder { color: #6c7580 !important; }

    #zh-clean-search-submit {
      width: 32px !important;
      height: 32px !important;
      margin-right: 6px !important;
      border-radius: 50% !important;
      background: #0066ff !important;
      border: none !important;
      color: #ffffff !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: transform 0.2s ease, background 0.2s ease !important;
      padding: 0 !important;
      flex-shrink: 0 !important;
    }

    #zh-clean-search-submit:hover {
      background: #0052cc !important;
      transform: scale(1.06) !important;
    }

    #zh-clean-search-submit svg {
      width: 16px !important;
      height: 16px !important;
      stroke: #ffffff !important;
      stroke-width: 2.4 !important;
      stroke-linecap: round !important;
      stroke-linejoin: round !important;
      fill: none !important;
    }

    /* === 7. 页面布局与现代排版（覆盖首页、问答页、搜索页、专栏页） === */
    html, body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", sans-serif !important;
      -webkit-font-smoothing: antialiased !important;
      -moz-osx-font-smoothing: grayscale !important;
      text-rendering: optimizeLegibility !important;
      transition: background-color 0.25s ease, color 0.25s ease !important;
    }

    .Topstory-container,
    .Search-container {
      display: flex !important;
      justify-content: center !important;
      padding: 16px 0 60px 0 !important;
      width: 100% !important;
      background: transparent !important;
    }

    /* 专栏文章页主体居中 */
    .Topstory-mainColumn,
    .Question-mainColumn,
    .SearchMain,
    .SearchSections,
    .Post-Main,
    .Post-NormalMain,
    .Post-content,
    .css-fnjj4z {
      width: 100% !important;
      max-width: 1100px !important;
      margin: 0 auto !important;
      float: none !important;
      box-sizing: border-box !important;
    }

    .Post-Header,
    .Post-Author {
      width: 100% !important;
      max-width: 1100px !important;
      margin: 0 auto 16px auto !important;
    }

    .SearchTabs {
      width: 100% !important;
      max-width: 1100px !important;
      margin: 0 auto 12px auto !important;
      display: flex !important;
    }

    div.Question-main, .Question-main {
      display: flex !important;
      justify-content: center !important;
      width: 100% !important;
      min-width: unset !important;
      padding: 0 0 60px 0 !important;
      margin: 0 auto !important;
    }

    .QuestionHeader-content {
      width: 100% !important;
      max-width: 1100px !important;
      margin: 0 auto !important;
      padding: 0 !important;
      display: block !important;
    }

    .QuestionHeader-main {
      width: 100% !important;
      padding: 0 !important;
      margin: 0 !important;
    }

    .QuestionHeader-title {
      font-size: 22px !important;
      font-weight: 700 !important;
      line-height: 1.45 !important;
      letter-spacing: 0.015em !important;
    }

    .Post-Title,
    h1.Post-Title {
      font-size: 26px !important;
      font-weight: 700 !important;
      line-height: 1.4 !important;
      margin: 20px 0 16px 0 !important;
      letter-spacing: 0.015em !important;
    }

    /* 问答详情页 & 专栏文章去除独立卡片外框，文字直接呈现在底层页面上 */
    .Question-mainColumn .Card,
    .Question-mainColumn .AnswerCard,
    .Question-mainColumn .ContentItem,
    .QuestionHeader,
    .Post-Main,
    .Post-NormalMain,
    .Post-content {
      background: transparent !important;
      border: none !important;
      box-shadow: none !important;
      border-radius: 0 !important;
    }

    .SearchResult-Card,
    .Topstory-mainColumn .Card,
    .Topstory-mainColumn .TopstoryItem {
      border-radius: 12px !important;
      margin-bottom: 16px !important;
      padding: 20px 24px !important;
    }

    .ContentItem-title, .ContentItem-title a {
      font-size: 19px !important;
      font-weight: 600 !important;
      line-height: 1.55 !important;
      letter-spacing: 0.015em !important;
    }

    .RichContent, .RichText, .RichText ztext, .ContentItem-more,
    .Post-RichTextContainer, .Post-RichTextContainer p {
      font-size: 16px !important;
      line-height: 1.76 !important;
      letter-spacing: 0.02em !important;
    }

    .RichText p, .Post-RichTextContainer p { margin: 1.2em 0 !important; }

    /* === 8. 白天模式 === */
    html:not(.zh-dark-mode), html:not(.zh-dark-mode) body {
      background-color: #f5f7fa !important;
      color: #2c323b !important;
    }

    html:not(.zh-dark-mode) .QuestionHeader-title,
    html:not(.zh-dark-mode) .Post-Title,
    html:not(.zh-dark-mode) .ContentItem-title,
    html:not(.zh-dark-mode) .ContentItem-title a {
      color: #1a1d21 !important;
    }

    html:not(.zh-dark-mode) .Topstory-mainColumn .Card,
    html:not(.zh-dark-mode) .SearchResult-Card {
      background: #ffffff !important;
      border: 1px solid rgba(0, 0, 0, 0.03) !important;
      box-shadow: 0 2px 12px rgba(0, 15, 40, 0.04) !important;
    }

    html:not(.zh-dark-mode) .RichContent,
    html:not(.zh-dark-mode) .RichText,
    html:not(.zh-dark-mode) .Post-RichTextContainer,
    html:not(.zh-dark-mode) .Post-RichTextContainer * {
      color: #303742 !important;
    }

    /* === 9. 黑夜模式 === */
    html.zh-dark-mode, html.zh-dark-mode body {
      background-color: #111316 !important;
      color: #d1d6e0 !important;
    }

    html.zh-dark-mode .QuestionHeader-title,
    html.zh-dark-mode .Post-Title,
    html.zh-dark-mode .ContentItem-title,
    html.zh-dark-mode .ContentItem-title a {
      color: #ffffff !important;
    }

    html.zh-dark-mode .Topstory-mainColumn .Card,
    html.zh-dark-mode .SearchResult-Card {
      background: #191c20 !important;
      border: 1px solid rgba(255, 255, 255, 0.07) !important;
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.3) !important;
    }

    html.zh-dark-mode .AuthorInfo-name a,
    html.zh-dark-mode .Post-Author a {
      color: #e4e7eb !important;
    }

    html.zh-dark-mode .AuthorInfo-badge,
    html.zh-dark-mode .AuthorInfo-detail,
    html.zh-dark-mode .Post-Author span {
      color: #7b8390 !important;
    }

    html.zh-dark-mode .RichContent,
    html.zh-dark-mode .RichText,
    html.zh-dark-mode .RichText *,
    html.zh-dark-mode .Post-RichTextContainer,
    html.zh-dark-mode .Post-RichTextContainer *,
    html.zh-dark-mode .ztext,
    html.zh-dark-mode .ztext *,
    html.zh-dark-mode p,
    html.zh-dark-mode li {
      color: #d1d6e0 !important;
    }

    html.zh-dark-mode a { color: #58a6ff !important; }
    html.zh-dark-mode em.Highlight { color: #ff7b72 !important; font-style: normal !important; font-weight: 600 !important; }
    html.zh-dark-mode .ContentItem-more { color: #4096ff !important; }

    html.zh-dark-mode div:has(> .RichContent-actions),
    html.zh-dark-mode div[class*="PostItem-actions"],
    html.zh-dark-mode div[class*="css-1p1wstz"],
    html.zh-dark-mode div[class*="css-p1wstz"] {
      background: #191c20 !important;
      background-color: #191c20 !important;
      border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
    }

    /* === 10. 彻底消除吸底操作栏大白条与浮动收起按钮白底 === */
    html.zh-dark-mode .ContentItem-actions.is-fixed,
    html.zh-dark-mode .RichContent-actions.is-fixed,
    html.zh-dark-mode .ContentItem-actions.Sticky.is-fixed {
      background: #191c20 !important;
      background-color: #191c20 !important;
      box-shadow: 0 -3px 12px rgba(0, 0, 0, 0.45) !important;
      border-top: 1px solid rgba(255, 255, 255, 0.08) !important;
    }

    html.zh-dark-mode .ContentItem-actions.is-fixed button,
    html.zh-dark-mode .ContentItem-actions.is-fixed .Button--plain {
      color: #9ba4b0 !important;
    }

    html.zh-dark-mode button[class*="css-1503iqi"],
    html.zh-dark-mode div[class*="css-p1wstz"] button {
      background: #252930 !important;
      background-color: #252930 !important;
      color: #d1d6e0 !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.4) !important;
    }

    /* === 11. 评论区：消除白边白底 & 强制高对比度浅白文字 === */
    div[class*="css-14zbeoe"],
    div[class*="css-u76jt1"],
    div[class*="css-79elbk"],
    div[class*="css-1fo89v5"],
    .Comments-container,
    .CommentsV2 {
      border: none !important;
      box-shadow: none !important;
    }

    html.zh-dark-mode div[class*="css-14zbeoe"] {
      background: #191c20 !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      border-radius: 8px !important;
    }

    html.zh-dark-mode .InputLike,
    html.zh-dark-mode .Editable,
    html.zh-dark-mode .Editable-content,
    html.zh-dark-mode div[class*="DraftEditor"],
    html.zh-dark-mode div.InputLike {
      background: transparent !important;
      background-color: transparent !important;
      color: #d1d6e0 !important;
      border: none !important;
      box-shadow: none !important;
    }

    html.zh-dark-mode div[class*="public-DraftEditorPlaceholder-inner"] { color: #717b88 !important; }
    html.zh-dark-mode div[class*="css-u76jt1"] { background: transparent !important; border: none !important; padding: 0 !important; }
    html.zh-dark-mode div[class*="css-97fdvh"] { background: #191c20 !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; border-radius: 6px !important; }
    html.zh-dark-mode div[class*="css-m0zh86"], html.zh-dark-mode div[class*="css-1fjr6cy"] { color: #8c96a4 !important; }
    html.zh-dark-mode div[class*="css-kt4t4n"] { background: #252930 !important; color: #ffffff !important; }
    html.zh-dark-mode div[class*="css-jp43l4"] { border-bottom: 1px solid rgba(255, 255, 255, 0.06) !important; }

    html.zh-dark-mode .CommentContent,
    html.zh-dark-mode .CommentContent *,
    html.zh-dark-mode div[class*="CommentContent"],
    html.zh-dark-mode div[class*="CommentContent"] *,
    html.zh-dark-mode .Comments-container p,
    html.zh-dark-mode .Comments-container span:not([class*="badge"]) {
      color: #e4e7eb !important;
    }

    html.zh-dark-mode .Comments-container a,
    html.zh-dark-mode .Comments-container a *,
    html.zh-dark-mode .Comments-container .UserLink-link {
      color: #58a6ff !important;
      font-weight: 500 !important;
    }

    html.zh-dark-mode .Comments-container button,
    html.zh-dark-mode .Comments-container button * {
      color: #9ba4b0 !important;
    }

    /* === 12. 楼中楼对话弹窗、Modal与Dialog全系暗黑化 === */
    html.zh-dark-mode .Modal,
    html.zh-dark-mode .Modal-inner,
    html.zh-dark-mode .Modal-content,
    html.zh-dark-mode div[role="dialog"],
    html.zh-dark-mode div[class*="Modal-"],
    html.zh-dark-mode div[class*="Modal"],
    html.zh-dark-mode div[class*="Dialog"],
    html.zh-dark-mode div[class*="Drawer"],
    html.zh-dark-mode div[class*="CommentDetail"],
    html.zh-dark-mode div[class*="CommentSubList"],
    html.zh-dark-mode div[class*="Comments-container--dialog"],
    html.zh-dark-mode div[class*="CommentsV2-dialog"],
    html.zh-dark-mode div[class*="css-"]:has(> div > div > button[aria-label="关闭"]),
    html.zh-dark-mode div[class*="css-"]:has(> div[class*="CommentContent"]) {
      background: #191c20 !important;
      background-color: #191c20 !important;
      color: #d1d6e0 !important;
      border: 1px solid rgba(255, 255, 255, 0.1) !important;
      box-shadow: 0 8px 32px rgba(0, 0, 0, 0.6) !important;
    }

    html.zh-dark-mode .Modal-wrapper,
    html.zh-dark-mode .Modal-backdrop,
    html.zh-dark-mode div[class*="backdrop"],
    html.zh-dark-mode div[class*="mask"] {
      background-color: rgba(0, 0, 0, 0.65) !important;
    }

    html.zh-dark-mode div[role="dialog"] *,
    html.zh-dark-mode .Modal *,
    html.zh-dark-mode div[class*="Modal-"] *,
    html.zh-dark-mode div[class*="CommentDetail"] * {
      background-color: transparent !important;
      border-color: rgba(255, 255, 255, 0.08) !important;
    }

    /* === 13. 精简悬浮四按钮 === */
    #zh-floating-actions {
      position: fixed;
      right: 42px;
      bottom: 120px;
      display: flex;
      flex-direction: column;
      gap: 12px;
      z-index: 999999;
      opacity: 0.1 !important;
      transition: opacity 0.25s ease !important;
    }

    #zh-floating-actions:hover {
      opacity: 1 !important;
    }

    .zh-action-btn {
      box-sizing: border-box !important;
      width: 48px !important;
      height: 48px !important;
      background: #0066ff !important;
      color: #ffffff !important;
      border: none !important;
      border-radius: 50% !important;
      box-shadow: 0 4px 14px rgba(0, 102, 255, 0.35) !important;
      cursor: pointer !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1) !important;
      outline: none !important;
      padding: 0 !important;
      margin: 0 !important;
      user-select: none !important;
      position: relative !important;
    }

    html.zh-dark-mode .zh-action-btn {
      background: #1f6feb !important;
      box-shadow: 0 4px 14px rgba(0, 0, 0, 0.5) !important;
    }

    .zh-action-btn:hover { background: #0052cc !important; transform: scale(1.08) !important; }
    html.zh-dark-mode .zh-action-btn:hover { background: #388bfd !important; }
    .zh-action-btn:active { transform: scale(0.95) !important; }

    .zh-action-btn svg,
    .zh-action-btn svg * {
      fill: none !important;
      stroke: #ffffff !important;
      stroke-width: 2.4 !important;
      stroke-linecap: round !important;
      stroke-linejoin: round !important;
    }

    .zh-action-btn svg { width: 22px !important; height: 22px !important; display: block !important; }
    #zh-clean-home-btn.rotating svg { animation: zh-spin 0.6s linear infinite !important; }
    @keyframes zh-spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

    /* === 14. 摸鱼键专属快捷键指引 === */
    .zh-shortcut-guide {
      position: absolute !important;
      right: calc(100% + 14px) !important;
      top: 50% !important;
      transform: translateY(-50%) translateX(8px) !important;
      width: 230px !important;
      padding: 14px 16px !important;
      border-radius: 10px !important;
      font-size: 13px !important;
      line-height: 1.5 !important;
      box-sizing: border-box !important;
      opacity: 0 !important;
      visibility: hidden !important;
      pointer-events: none !important;
      transition: opacity 0.2s ease, visibility 0.2s ease, transform 0.2s ease !important;
      z-index: 1000000 !important;
      text-align: left !important;
      user-select: none !important;
      white-space: normal !important;
    }

    #zh-clean-boss-btn:hover .zh-shortcut-guide {
      opacity: 1 !important;
      visibility: visible !important;
      pointer-events: auto !important;
      transform: translateY(-50%) translateX(0) !important;
    }

    html:not(.zh-dark-mode) .zh-shortcut-guide {
      background: #ffffff !important;
      color: #333a44 !important;
      border: 1px solid rgba(0, 0, 0, 0.08) !important;
      box-shadow: 0 8px 24px rgba(0, 20, 50, 0.12) !important;
    }

    html.zh-dark-mode .zh-shortcut-guide {
      background: #1c1f24 !important;
      color: #e4e7eb !important;
      border: 1px solid rgba(255, 255, 255, 0.12) !important;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.6) !important;
    }

    .zh-guide-title {
      font-weight: 600 !important;
      font-size: 13px !important;
      margin-bottom: 10px !important;
      padding-bottom: 6px !important;
      border-bottom: 1px solid rgba(120, 130, 140, 0.15) !important;
      color: #0066ff !important;
      display: flex !important;
      align-items: center !important;
      gap: 6px !important;
    }

    html.zh-dark-mode .zh-guide-title { color: #58a6ff !important; }
    .zh-guide-item { display: flex !important; align-items: center !important; justify-content: space-between !important; margin-bottom: 7px !important; font-size: 12px !important; }
    .zh-guide-item kbd { display: inline-block !important; padding: 2px 6px !important; border-radius: 4px !important; font-family: Consolas, monospace !important; font-size: 11px !important; font-weight: 600 !important; line-height: 1 !important; }
    html:not(.zh-dark-mode) .zh-guide-item kbd { background: #eef1f5 !important; border: 1px solid #d0d7de !important; color: #0066ff !important; box-shadow: inset 0 -1px 0 #c2cad3 !important; }
    html.zh-dark-mode .zh-guide-item kbd { background: #282d34 !important; border: 1px solid rgba(255, 255, 255, 0.15) !important; color: #79c0ff !important; box-shadow: inset 0 -1px 0 rgba(0, 0, 0, 0.4) !important; }
    .zh-guide-tip { font-size: 11px !important; opacity: 0.6 !important; margin-top: 8px !important; text-align: center !important; }

    /* === 15. 1:1 像素级高保真 VS Code 代码编辑器全屏伪装 === */
    #zh-boss-mask {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: #1e1e1e !important;
      color: #d4d4d4 !important;
      font-family: Consolas, "Fira Code", Menlo, Monaco, "Courier New", monospace !important;
      font-size: 13.5px !important;
      box-sizing: border-box !important;
      z-index: 99999999 !important;
      display: none;
      flex-direction: column !important;
      overflow: hidden !important;
      user-select: none !important;
      cursor: default !important;
    }

    .vsc-tab-bar { display: flex !important; height: 35px !important; background: #252526 !important; align-items: flex-end !important; border-bottom: 1px solid #1e1e1e !important; flex-shrink: 0 !important; }
    .vsc-tab { height: 34px !important; display: flex !important; align-items: center !important; padding: 0 16px !important; font-size: 12.5px !important; color: #969696 !important; background: #2d2d2d !important; border-right: 1px solid #252526 !important; gap: 8px !important; cursor: pointer !important; }
    .vsc-tab.active { background: #1e1e1e !important; color: #ffffff !important; border-top: 1px solid #007acc !important; }
    .vsc-tab .close-icon { font-size: 12px !important; opacity: 0.6 !important; margin-left: 4px !important; }
    .vsc-breadcrumb { height: 22px !important; display: flex !important; align-items: center !important; padding: 0 16px !important; font-size: 11.5px !important; color: #8c8c8c !important; background: #1e1e1e !important; gap: 6px !important; border-bottom: 1px solid rgba(255, 255, 255, 0.05) !important; flex-shrink: 0 !important; }
    .vsc-editor-body { flex: 1 !important; display: flex !important; overflow: hidden !important; background: #1e1e1e !important; line-height: 20px !important; }
    .vsc-gutter { width: 52px !important; background: #1e1e1e !important; border-right: 1px solid rgba(255, 255, 255, 0.04) !important; padding: 10px 0 !important; text-align: right !important; color: #858585 !important; user-select: none !important; font-size: 13px !important; line-height: 20px !important; padding-right: 12px !important; flex-shrink: 0 !important; }
    .vsc-code-content { flex: 1 !important; padding: 10px 16px !important; overflow-y: auto !important; white-space: pre !important; font-size: 13.5px !important; line-height: 20px !important; }
    .syn-kwd { color: #569cd6 !important; }
    .syn-ann { color: #dcdcaa !important; }
    .syn-cls { color: #4ec9b0 !important; }
    .syn-fn  { color: #dcdcaa !important; }
    .syn-str { color: #ce9178 !important; }
    .syn-cmt { color: #6a9955 !important; }
    .syn-var { color: #9cdcfe !important; }
    .vsc-status-bar { height: 22px !important; background: #007acc !important; color: #ffffff !important; display: flex !important; align-items: center !important; justify-content: space-between !important; padding: 0 10px !important; font-size: 12px !important; flex-shrink: 0 !important; }
    .vsc-status-left, .vsc-status-right { display: flex !important; align-items: center !important; gap: 14px !important; }
  `;

  if (typeof GM_addStyle !== 'undefined') {
    GM_addStyle(css);
  } else {
    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.documentElement.appendChild(styleEl);
  }

  // 2. 标签栏 Title 与 彻底消灭知乎 Favicon
  const fakeTitle = '项目微服务架构设计与接口调试指南 - 文档中心';
  document.title = fakeTitle;
  try {
    Object.defineProperty(document, 'title', {
      set: () => {},
      get: () => fakeTitle,
      configurable: true,
    });
  } catch (e) {}

  const neutralFavicon = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="%23999"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8" fill="%23666"/></svg>';

  function purgeAndLockFavicons() {
    document.querySelectorAll("link[rel*='icon'], link[rel*='shortcut'], link[rel*='apple-touch']").forEach(el => {
      if (!el.id.startsWith('zh-clean-fake-icon')) el.remove();
    });

    ['icon', 'shortcut icon', 'apple-touch-icon'].forEach(rel => {
      const id = 'zh-clean-fake-icon-' + rel.replace(/\s+/g, '-');
      let link = document.getElementById(id);
      if (!link) {
        link = document.createElement('link');
        link.id = id;
        link.rel = rel;
        link.type = 'image/svg+xml';
        link.href = neutralFavicon;
        document.head.appendChild(link);
      }
    });
  }
  purgeAndLockFavicons();

  const headObserver = new MutationObserver((mutations) => {
    for (const m of mutations) {
      for (const node of m.addedNodes) {
        if (node.tagName === 'LINK' && (node.rel.includes('icon') || node.rel.includes('apple-touch'))) {
          if (!node.id || !node.id.startsWith('zh-clean-fake-icon')) {
            node.remove();
          }
        }
      }
    }
  });
  headObserver.observe(document.head, { childList: true });

  // 3. 回答时间自动置顶到回答头部（作者信息下方）
  function formatIsoDate(isoStr) {
    if (!isoStr) return '';
    try {
      const d = new Date(isoStr);
      const pad = n => String(n).padStart(2, '0');
      const year = d.getFullYear();
      const month = pad(d.getMonth() + 1);
      const day = pad(d.getDate());
      const hours = pad(d.getHours());
      const minutes = pad(d.getMinutes());
      return `${year}-${month}-${day} ${hours}:${minutes}`;
    } catch (e) {
      return '';
    }
  }

  function hoistAllAnswerTimes() {
    const answers = document.querySelectorAll('.ContentItem.AnswerItem, .TopstoryItem');
    answers.forEach(item => {
      let timeEl = item.querySelector('.ContentItem-time');
      const metaCreated = item.querySelector('meta[itemprop="dateCreated"]')?.getAttribute('content');
      const metaModified = item.querySelector('meta[itemprop="dateModified"]')?.getAttribute('content');

      if (!timeEl && (metaCreated || metaModified)) {
        const isEdit = metaModified && metaModified !== metaCreated;
        const dateText = formatIsoDate(isEdit ? metaModified : metaCreated);
        if (dateText) {
          timeEl = document.createElement('div');
          timeEl.className = 'ContentItem-time zh-meta-created-time';
          const label = isEdit ? '编辑于 ' : '发布于 ';
          timeEl.textContent = label + dateText;
        }
      }

      if (!timeEl) return;
      if (timeEl.classList.contains('zh-hoisted-time')) return;

      timeEl.classList.add('zh-hoisted-time');

      const authorDetail = item.querySelector('.AuthorInfo-detail');
      const authorContent = item.querySelector('.AuthorInfo-content');
      const meta = item.querySelector('.ContentItem-meta');

      if (authorDetail) {
        authorDetail.insertAdjacentElement('afterend', timeEl);
      } else if (authorContent) {
        authorContent.appendChild(timeEl);
      } else if (meta) {
        meta.appendChild(timeEl);
      }
    });
  }

  // 4. 鼠标悬停捕获：实时记录鼠标当前停留的回答，供 C 键定向操作
  let hoveredAnswerItem = null;
  document.addEventListener('mouseover', (e) => {
    const item = e.target.closest ? e.target.closest('.ContentItem.AnswerItem, .TopstoryItem, .Card.AnswerCard') : null;
    if (item) hoveredAnswerItem = item;
  }, { passive: true });

  // 4.1 按 C 键智能切换鼠标当前停留回答的评论：展开 / 收起 / 关闭弹窗
  function toggleComments() {
    // 优先关闭楼中楼弹窗
    const dialogCloseBtn = document.querySelector('div[role="dialog"] button[aria-label="关闭"], .Modal button[aria-label="关闭"], div[class*="Modal-closeButton"]');
    if (dialogCloseBtn) {
      dialogCloseBtn.click();
      return;
    }

    // 目标回答：优先取鼠标当前停留的回答，未捕获到时兜底取视口中央回答
    let targetItem = hoveredAnswerItem && document.body.contains(hoveredAnswerItem) ? hoveredAnswerItem : null;

    if (!targetItem) {
      const items = Array.from(document.querySelectorAll('.ContentItem.AnswerItem, .TopstoryItem'));
      if (items.length > 0) {
        const vCenter = window.innerHeight / 2;
        let minDiff = Infinity;
        targetItem = items[0];
        for (const item of items) {
          const r = item.getBoundingClientRect();
          const diff = Math.abs(r.top + r.height / 2 - vCenter);
          if (diff < minDiff) {
            minDiff = diff;
            targetItem = item;
          }
        }
      }
    }

    if (!targetItem) return;

    // 仅在目标回答内部查找评论按钮（作用域天然排除插件自身的悬浮指引按钮）
    const btnsInTarget = Array.from(targetItem.querySelectorAll('button:not(.zh-action-btn):not(#zh-floating-actions *)'));
    const collapseBtn = btnsInTarget.find(b => b.textContent && b.textContent.includes('收起评论'));
    const hasExpandedContainer = !!targetItem.querySelector('.Comments-container, .CommentsV2');

    if (collapseBtn) {
      collapseBtn.click();
    } else if (hasExpandedContainer) {
      const fallbackBtn = btnsInTarget.find(b => b.textContent && (/\d+\s*条评论/.test(b.textContent) || b.textContent.includes('评论')));
      if (fallbackBtn) fallbackBtn.click();
    } else {
      const expandBtn = btnsInTarget.find(b => b.textContent && (/\d+\s*条评论/.test(b.textContent) || b.textContent.includes('添加评论')));
      if (expandBtn) expandBtn.click();
    }
  }

  // 5. 平滑滚动到顶部
  function smoothScrollToTop(callback) {
    const step = () => {
      const current = window.scrollY || document.documentElement.scrollTop;
      if (current > 5) {
        window.scrollTo(0, Math.floor(current * 0.72));
        requestAnimationFrame(step);
      } else {
        window.scrollTo(0, 0);
        document.documentElement.scrollTop = 0;
        if (typeof callback === 'function') callback();
      }
    };
    step();
  }

  // 6. Home 与 刷新合二为一的路由/刷新逻辑
  function goHomeOrRefresh() {
    const isHomePage = location.pathname === '/' || location.pathname === '';
    if (isHomePage) {
      const homeBtn = document.getElementById('zh-clean-home-btn');
      if (homeBtn) homeBtn.classList.add('rotating');
      smoothScrollToTop(() => {
        const recommendTab = document.querySelector('nav a[href="https://www.zhihu.com/"], nav a[href="/"]');
        if (recommendTab) {
          recommendTab.click();
        } else {
          setTimeout(() => location.reload(), 250);
        }
      });
      setTimeout(() => {
        if (homeBtn) homeBtn.classList.remove('rotating');
      }, 800);
    } else {
      window.location.href = 'https://www.zhihu.com/';
    }
  }

  // 7. 构建并挂载顶部极简搜索栏
  function insertSearchBar() {
    if (document.getElementById('zh-clean-searchbar-wrapper')) return;

    const searchParams = new URLSearchParams(window.location.search);
    const currentQuery = searchParams.get('q') || '';

    const wrapper = document.createElement('div');
    wrapper.id = 'zh-clean-searchbar-wrapper';
    wrapper.innerHTML = `
      <div class="zh-clean-searchbar">
        <svg class="zh-search-icon" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
        <input type="text" id="zh-clean-search-input" value="${currentQuery.replace(/"/g, '&quot;')}" placeholder="搜索知乎内容或技术主题... (按 Enter 搜索，或按 / 快速聚焦)" autocomplete="off" />
        <button id="zh-clean-search-submit" title="开始搜索" aria-label="搜索">
          <svg viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"></polyline></svg>
        </button>
      </div>
    `;

    const doSearch = () => {
      const input = document.getElementById('zh-clean-search-input');
      const q = input ? input.value.trim() : '';
      if (q) {
        window.location.href = 'https://www.zhihu.com/search?type=content&q=' + encodeURIComponent(q);
      }
    };

    wrapper.querySelector('#zh-clean-search-submit').onclick = doSearch;
    wrapper.querySelector('#zh-clean-search-input').onkeydown = (e) => {
      if (e.key === 'Enter') doSearch();
    };

    const root = document.querySelector('main, .App-main, #root') || document.body;
    root.insertAdjacentElement('beforebegin', wrapper);
  }

  // 8. 构建真实 VS Code 编辑器全屏掩护层
  function toggleBossMask() {
    const mask = document.getElementById('zh-boss-mask');
    if (mask) {
      const isShown = mask.style.display === 'flex';
      mask.style.display = isShown ? 'none' : 'flex';
    }
  }

  function initBossMask() {
    if (document.getElementById('zh-boss-mask')) return;
    const mask = document.createElement('div');
    mask.id = 'zh-boss-mask';
    const lineNumbers = Array.from({ length: 36 }, (_, i) => i + 1).join('<br/>');

    mask.innerHTML = `
      <div class="vsc-tab-bar">
        <div class="vsc-tab active"><span style="color: #e5a824;">☕</span> GatewaySecurityConfig.java <span class="close-icon">×</span></div>
        <div class="vsc-tab"><span style="color: #6a9955;">⚙</span> application-prod.yml <span class="close-icon">×</span></div>
        <div class="vsc-tab"><span style="color: #e5a824;">☕</span> AuthReactiveFilter.java <span class="close-icon">×</span></div>
      </div>
      <div class="vsc-breadcrumb">
        <span>gateway-cluster</span> › <span>src</span> › <span>main</span> › <span>java</span> › <span>com</span> › <span>arch</span> › <span>gateway</span> › <span>config</span> › <span>GatewaySecurityConfig.java</span> › <span>filterChain</span>
      </div>
      <div class="vsc-editor-body">
        <div class="vsc-gutter">${lineNumbers}</div>
        <div class="vsc-code-content"><span class="syn-kwd">package</span> com.arch.gateway.config;

<span class="syn-kwd">import</span> org.springframework.context.annotation.Bean;
<span class="syn-kwd">import</span> org.springframework.context.annotation.Configuration;
<span class="syn-kwd">import</span> org.springframework.security.config.annotation.web.reactive.EnableWebFluxSecurity;
<span class="syn-kwd">import</span> org.springframework.security.config.web.server.ServerHttpSecurity;
<span class="syn-kwd">import</span> org.springframework.security.web.server.SecurityWebFilterChain;
<span class="syn-kwd">import</span> org.springframework.security.web.server.context.NoOpServerSecurityContextRepository;
<span class="syn-kwd">import</span> reactor.core.publisher.Mono;

<span class="syn-cmt">/**
 * Core Microservice Reactive Security & Access Control Configuration.
 * High-throughput non-blocking filter chain for RPC/HTTP dispatch.
 */</span>
<span class="syn-ann">@Configuration</span>
<span class="syn-ann">@EnableWebFluxSecurity</span>
<span class="syn-kwd">public class</span> <span class="syn-cls">GatewaySecurityConfig</span> {

    <span class="syn-kwd">private static final</span> <span class="syn-cls">String</span>[] <span class="syn-var">EXCLUDED_PATHS</span> = {
        <span class="syn-str">"/api/v1/auth/**"</span>,
        <span class="syn-str">"/actuator/health"</span>,
        <span class="syn-str">"/swagger-ui.html"</span>
    };

    <span class="syn-ann">@Bean</span>
    <span class="syn-kwd">public</span> <span class="syn-cls">SecurityWebFilterChain</span> <span class="syn-fn">filterChain</span>(<span class="syn-cls">ServerHttpSecurity</span> <span class="syn-var">http</span>) {
        <span class="syn-kwd">return</span> <span class="syn-var">http</span>
            .<span class="syn-fn">csrf</span>(<span class="syn-cls">ServerHttpSecurity.CsrfSpec</span>::<span class="syn-fn">disable</span>)
            .<span class="syn-fn">securityContextRepository</span>(<span class="syn-cls">NoOpServerSecurityContextRepository</span>.<span class="syn-fn">getInstance</span>())
            .<span class="syn-fn">authorizeExchange</span>(<span class="syn-var">exchanges</span> -&gt; <span class="syn-var">exchanges</span>
                .<span class="syn-fn">pathMatchers</span>(<span class="syn-var">EXCLUDED_PATHS</span>).<span class="syn-fn">permitAll</span>()
                .<span class="syn-fn">pathMatchers</span>(<span class="syn-str">"/api/v1/admin/**"</span>).<span class="syn-fn">hasAuthority</span>(<span class="syn-str">"SCOPE_admin"</span>)
                .<span class="syn-fn">anyExchange</span>().<span class="syn-fn">authenticated</span>()
            )
            .<span class="syn-fn">oauth2ResourceServer</span>(<span class="syn-cls">ServerHttpSecurity.OAuth2ResourceServerSpec</span>::<span class="syn-fn">jwt</span>)
            .<span class="syn-fn">build</span>();
    }
}</div>
      </div>
      <div class="vsc-status-bar">
        <div class="vsc-status-left">
          <span>⎇ main*</span>
          <span>0 ⨂  0 ⚠️</span>
        </div>
        <div class="vsc-status-right">
          <span>Ln 28, Col 24</span>
          <span>Spaces: 4</span>
          <span>UTF-8</span>
          <span>LF</span>
          <span>Java</span>
          <span>Prettier</span>
        </div>
      </div>
    `;

    mask.addEventListener('click', toggleBossMask);
    document.body.appendChild(mask);
  }

  // 9. 键盘全局监听（仅保留 Esc 老板键）
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      const isInputActive = ['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)
        || (document.activeElement && document.activeElement.isContentEditable);
      if (!isInputActive) {
        e.preventDefault();
        toggleBossMask();
      }
    }
  });

  const moonIcon = `<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
  const sunIcon = `<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

  function updateThemeButtonIcon(btn, isDark) {
    btn.innerHTML = isDark ? sunIcon : moonIcon;
    btn.setAttribute('aria-label', isDark ? '切换为白天模式' : '切换为黑夜模式');
  }

  // 10. 动态扫描物理移除广告
  function purgeAllAds() {
    const adSelectors = [
      '.pc-article-answer-big-img',
      'div[class*="pc-article-answer-"]',
      '.TopstoryItem--advertCard',
      'div[data-za-detail-view-element_name="Ad"]',
      '.AdvertImg',
    ];
    document.querySelectorAll(adSelectors.join(',')).forEach(el => {
      const card = el.closest('div[class*="pc-article-answer"]') || el.closest('.TopstoryItem--advertCard') || el;
      if (card) card.remove();
    });

    Array.from(document.querySelectorAll('span, div')).forEach(el => {
      if (el.children.length === 0 && (el.textContent.trim() === '的广告' || el.textContent.trim() === '广告')) {
        const adContainer = el.closest('.Card') || el.closest('.pc-article-answer-big-img') || el.closest('div[class*="pc-article-answer"]') || el.closest('div[style*="border-radius"]');
        if (adContainer && !adContainer.querySelector('.RichText')) {
          adContainer.remove();
        }
      }
    });
  }

  // 11. 首页频道防跳转
  function ensureRecommendTab() {
    const homeChannelTabs = ['/follow', '/hot', '/explore', '/column-square'];
    if (homeChannelTabs.includes(location.pathname)) {
      location.replace('https://www.zhihu.com/');
    }
  }

  // 12. 创建精简四操作悬浮栏（Home与刷新合一）
  function insertFloatingActions() {
    if (document.getElementById('zh-floating-actions')) return;
    if (!document.body) return;

    const container = document.createElement('div');
    container.id = 'zh-floating-actions';

    // (1) Home / 刷新 合一主键
    const homeBtn = document.createElement('button');
    homeBtn.id = 'zh-clean-home-btn';
    homeBtn.className = 'zh-action-btn';
    homeBtn.setAttribute('aria-label', '推荐主页 / 刷新 (H)');
    homeBtn.innerHTML = `
      <svg viewBox="0 0 24 24">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"></path>
        <polyline points="9 22 9 12 15 12 15 22"></polyline>
      </svg>
    `;
    homeBtn.addEventListener('click', goHomeOrRefresh);

    // (2) 昼夜切换按钮
    const themeBtn = document.createElement('button');
    themeBtn.id = 'zh-clean-theme-btn';
    themeBtn.className = 'zh-action-btn';
    const currentIsDark = document.documentElement.classList.contains('zh-dark-mode');
    updateThemeButtonIcon(themeBtn, currentIsDark);

    themeBtn.addEventListener('click', () => {
      const isDark = document.documentElement.classList.toggle('zh-dark-mode');
      localStorage.setItem('zh_theme', isDark ? 'dark' : 'light');
      if (isDark) {
        document.documentElement.style.backgroundColor = '#111316';
      } else {
        document.documentElement.style.backgroundColor = '#f5f7fa';
      }
      updateThemeButtonIcon(themeBtn, isDark);
    });

    // (3) 可视化摸鱼键（终端命令行代码图标 >_ ）
    const bossBtn = document.createElement('button');
    bossBtn.id = 'zh-clean-boss-btn';
    bossBtn.className = 'zh-action-btn';
    bossBtn.setAttribute('aria-label', '摸鱼伪装 (Esc)');
    bossBtn.innerHTML = `
      <svg viewBox="0 0 24 24">
        <polyline points="4 17 10 11 4 5"></polyline>
        <line x1="12" y1="19" x2="20" y2="19"></line>
      </svg>
      <div class="zh-shortcut-guide">
        <div class="zh-guide-title">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="16" x2="12" y2="12"></line><line x1="12" y1="8" x2="12.01" y2="8"></line></svg>
          快捷操作
        </div>
        <div class="zh-guide-item"><span><kbd>Esc</kbd></span><span>老板键 (代码掩护)</span></div>
        <div class="zh-guide-tip">（其余功能请点击下方按钮操作）</div>
      </div>
    `;
    bossBtn.addEventListener('click', toggleBossMask);

    // (4) 回到顶部按钮
    const backToTopBtn = document.createElement('button');
    backToTopBtn.id = 'zh-clean-top-btn';
    backToTopBtn.className = 'zh-action-btn';
    backToTopBtn.setAttribute('aria-label', '回到顶部 (T)');
    backToTopBtn.innerHTML = `
      <svg viewBox="0 0 24 24">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    `;
    backToTopBtn.addEventListener('click', () => {
      smoothScrollToTop();
    });

    container.appendChild(homeBtn);
    container.appendChild(themeBtn);
    container.appendChild(bossBtn);
    container.appendChild(backToTopBtn);
    document.body.appendChild(container);
  }

  ensureRecommendTab();
  purgeAllAds();
  hoistAllAnswerTimes();

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      insertSearchBar();
      insertFloatingActions();
      initBossMask();
      purgeAllAds();
      hoistAllAnswerTimes();
    });
  } else {
    insertSearchBar();
    insertFloatingActions();
    initBossMask();
    hoistAllAnswerTimes();
  }

  // 监听 DOM 变动与单页路由切换
  const observer = new MutationObserver(() => {
    purgeAllAds();
    purgeAndLockFavicons();
    hoistAllAnswerTimes();
    if (!document.getElementById('zh-clean-searchbar-wrapper')) {
      insertSearchBar();
    }
    if (!document.getElementById('zh-floating-actions') && document.body) {
      insertFloatingActions();
    }
    if (!document.getElementById('zh-boss-mask') && document.body) {
      initBossMask();
    }
  });
  observer.observe(document.documentElement, { childList: true, subtree: true });
})();