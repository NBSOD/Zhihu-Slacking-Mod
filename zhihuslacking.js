// ==UserScript==
// @name         知乎极简沉浸纯净阅读与摸鱼防窥版-个人修改版
// @namespace    https://github.com/NBSOD/Zhihu-Slacking-Mod
// @version      1.0.3
// @description  基于原脚本「知乎极简沉浸 - 纯净阅读与摸鱼防窥版」改写：宽屏自适应(1100px)、仅保留 Esc 老板键。全站去顶栏/侧栏/广告/看山/操作条；彻底消灭丑陋白底骨架屏；回答时间自动置顶；问答页黑底白字平铺；消灭知乎页签图标；评论详情与楼中楼弹窗全黑夜化；顶部极简搜索栏；图片模糊防窥；右侧4浮钮；配备技术网站文章全屏伪装（按Esc或点击>_键触发）
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

    /* === 15. 技术网站文档伪装页面（老板键） === */
    #zh-boss-mask {
      position: fixed !important;
      top: 0 !important;
      left: 0 !important;
      width: 100vw !important;
      height: 100vh !important;
      background: #f4f5f5 !important;
      color: #333 !important;
      font-family: -apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", sans-serif !important;
      font-size: 15px !important;
      box-sizing: border-box !important;
      z-index: 99999999 !important;
      display: none;
      flex-direction: column !important;
      overflow: hidden !important;
      user-select: none !important;
      cursor: default !important;
    }

    .doc-header {
      height: 56px !important;
      background: #ffffff !important;
      color: #1d2129 !important;
      display: flex !important;
      align-items: center !important;
      padding: 0 32px !important;
      font-size: 15px !important;
      border-bottom: 1px solid #e5e6eb !important;
      flex-shrink: 0 !important;
      gap: 28px !important;
    }
    .doc-header .doc-logo {
      font-size: 18px !important;
      font-weight: 700 !important;
      color: #1e80ff !important;
      letter-spacing: 0.5px !important;
    }
    .doc-header .doc-nav-links {
      display: flex !important;
      gap: 24px !important;
      font-size: 14px !important;
      color: #515767 !important;
    }
    .doc-header .doc-nav-links span.active { color: #1e80ff !important; font-weight: 500 !important; }

    .doc-article-hero {
      background: #ffffff !important;
      border-bottom: 1px solid #e5e6eb !important;
      padding: 32px 32px 24px !important;
      flex-shrink: 0 !important;
    }
    .doc-article-hero h1 {
      font-size: 28px !important;
      font-weight: 700 !important;
      color: #1d2129 !important;
      margin: 0 0 12px 0 !important;
      line-height: 1.4 !important;
    }
    .doc-article-hero .doc-meta {
      font-size: 13px !important;
      color: #8a919f !important;
      display: flex !important;
      gap: 18px !important;
      align-items: center !important;
    }
    .doc-article-hero .doc-meta .doc-author {
      color: #515767 !important;
      font-weight: 500 !important;
    }
    .doc-article-hero .doc-meta .doc-tag {
      background: #f2f3f5 !important;
      color: #8a919f !important;
      padding: 2px 8px !important;
      border-radius: 3px !important;
      font-size: 12px !important;
    }

    .doc-body { flex: 1 !important; display: flex !important; overflow: hidden !important; background: #ffffff !important; }

    .doc-sidebar {
      width: 180px !important;
      background: #ffffff !important;
      border-right: 1px solid #f0f0f0 !important;
      padding: 24px 0 !important;
      overflow-y: auto !important;
      flex-shrink: 0 !important;
    }
    .doc-sidebar .doc-nav-title {
      font-size: 12px !important;
      font-weight: 600 !important;
      color: #8a919f !important;
      padding: 0 16px 10px !important;
      letter-spacing: 0.5px !important;
    }
    .doc-sidebar .doc-nav-item {
      padding: 5px 16px !important;
      font-size: 13px !important;
      color: #515767 !important;
      cursor: default !important;
      line-height: 20px !important;
      border-left: 2px solid transparent !important;
    }
    .doc-sidebar .doc-nav-item.active {
      background: #f7f8fa !important;
      color: #1e80ff !important;
      font-weight: 500 !important;
      border-left-color: #1e80ff !important;
    }

    .doc-content {
      flex: 1 !important;
      padding: 28px 48px 40px !important;
      overflow-y: auto !important;
      line-height: 1.85 !important;
      max-width: 780px !important;
    }
    .doc-content h2 {
      font-size: 20px !important;
      font-weight: 600 !important;
      color: #1d2129 !important;
      margin: 36px 0 14px 0 !important;
      padding-bottom: 8px !important;
      border-bottom: 1px solid #f0f0f0 !important;
    }
    .doc-content h3 {
      font-size: 17px !important;
      font-weight: 600 !important;
      color: #252933 !important;
      margin: 26px 0 10px 0 !important;
    }
    .doc-content p {
      color: #3c3d40 !important;
      margin: 10px 0 !important;
    }
    .doc-content .doc-code-block {
      background: #1e293b !important;
      color: #e2e8f0 !important;
      border-radius: 6px !important;
      padding: 16px 20px !important;
      font-family: "Fira Code", Consolas, monospace !important;
      font-size: 13.5px !important;
      line-height: 1.7 !important;
      margin: 14px 0 !important;
      overflow-x: auto !important;
      white-space: pre !important;
    }
    .doc-content .doc-table {
      width: 100% !important;
      border-collapse: collapse !important;
      margin: 14px 0 !important;
      font-size: 13.5px !important;
    }
    .doc-content .doc-table th {
      background: #f7f8fa !important;
      color: #1d2129 !important;
      font-weight: 600 !important;
      padding: 10px 14px !important;
      text-align: left !important;
      border-bottom: 2px solid #e5e6eb !important;
    }
    .doc-content .doc-table td {
      padding: 9px 14px !important;
      border-bottom: 1px solid #f7f8fa !important;
      color: #515767 !important;
    }
    .doc-content .doc-note {
      background: #e8f3ff !important;
      border-left: 4px solid #1e80ff !important;
      padding: 12px 16px !important;
      border-radius: 4px !important;
      margin: 14px 0 !important;
      color: #1d2129 !important;
      font-size: 13.5px !important;
    }

    .doc-footer {
      height: 36px !important;
      background: #ffffff !important;
      border-top: 1px solid #e5e6eb !important;
      display: flex !important;
      align-items: center !important;
      justify-content: center !important;
      padding: 0 32px !important;
      font-size: 12px !important;
      color: #8a919f !important;
      flex-shrink: 0 !important;
      gap: 30px !important;
    }
  `;

  if (typeof GM_addStyle !== 'undefined') {
    GM_addStyle(css);
  } else {
    const styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.documentElement.appendChild(styleEl);
  }

  // 2. 标签栏 Title 与 彻底消灭知乎 Favicon
  const fakeTitle = '企业级网络架构运维技术手册 - 内部文档';
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

    mask.innerHTML = `
      <div class="doc-header">
        <div class="doc-logo">NetTech</div>
        <div class="doc-nav-links">
          <span>首页</span>
          <span class="active">技术文章</span>
          <span>开源项目</span>
          <span>专栏</span>
          <span>问答</span>
        </div>
      </div>
      <div class="doc-article-hero">
        <h1>BGP路由协议深度解析与高可用架构设计</h1>
        <div class="doc-meta">
          <span class="doc-author">NetTech编辑部</span>
          <span>发布于 2026-09-15</span>
          <span>阅读 2,347</span>
          <span class="doc-tag">网络协议</span>
          <span class="doc-tag">BGP</span>
          <span class="doc-tag">高可用</span>
        </div>
      </div>
      <div class="doc-body">
        <div class="doc-sidebar">
          <div class="doc-nav-title">文章目录</div>
          <div class="doc-nav-item active">一、协议概述</div>
          <div class="doc-nav-item">二、核心概念与原理</div>
          <div class="doc-nav-item">三、路由决策与路径选择</div>
          <div class="doc-nav-item">四、高可用架构设计</div>
        </div>
        <div class="doc-content">
          <h2>一、协议概述</h2>
          <p>BGP（Border Gateway Protocol，边界网关协议）是互联网核心路由协议，运行在自治系统（AS）之间，负责在数百万条路由前缀中选择最优路径。当前广泛使用的版本为 BGP-4（RFC 4271），支持 CIDR 无类域间路由和路由聚合。</p>
          <p>在大型企业网络中，BGP 承担着多数据中心互联、多ISP出口负载均衡及跨地域骨干网路由的核心职责。无论是公有云还是私有数据中心，BGP 都是构建高可用网络架构的基石。</p>

          <h2>二、核心概念与基本原理</h2>
          <h3>2.1 自治系统（AS）</h3>
          <p>AS 是由同一管理机构控制的一组路由器的集合。BGP 在 AS 之间运行（eBGP），也在 AS 内部运行（iBGP）。每个 AS 拥有唯一的 AS 号（ASN），由 IANA 统一分配，范围从 1 到 4294967295。</p>

          <h3>2.2 路径向量协议</h3>
          <p>BGP 属于路径向量协议，在路由更新中携带完整的 AS 路径信息。接收方通过检查 AS 路径来防止路由环路——如果发现自己的 AS 号已出现在路径中，则丢弃该更新。这一机制使 BGP 天然具备防环能力。</p>

          <h3>2.3 BGP 状态机</h3>
          <p>BGP 对等体在建立连接的过程中经历严格的状态转换，确保双方能够稳定交换路由信息。</p>
          <table class="doc-table">
            <tr><th>状态</th><th>描述</th><th>关键动作</th></tr>
            <tr><td>Idle</td><td>初始状态，等待启动事件</td><td>初始化 TCP 连接资源</td></tr>
            <tr><td>Connect</td><td>尝试建立 TCP 连接</td><td>三次握手，等待完成</td></tr>
            <tr><td>Active</td><td>TCP 连接失败后重试</td><td>重新发起 Connect</td></tr>
            <tr><td>OpenSent</td><td>已发送 OPEN 报文</td><td>等待对端 OPEN 响应</td></tr>
            <tr><td>OpenConfirm</td><td>收到 OPEN，等待 Keepalive</td><td>验证参数兼容性</td></tr>
            <tr><td>Established</td><td>会话建立完成</td><td>交换 UPDATE 路由信息</td></tr>
          </table>

          <h2>三、路由决策与路径选择</h2>
          <p>BGP 使用多步决策算法在到达同一目的地的多条路径中选择最优路径。理解选路规则是网络运维工程师的必修课。</p>

          <h3>3.1 BGP 选路属性优先级</h3>
          <table class="doc-table">
            <tr><th>优先级</th><th>属性</th><th>说明</th></tr>
            <tr><td>1</td><td>Weight（Cisco 私有）</td><td>权重越大越优先，仅本地有效</td></tr>
            <tr><td>2</td><td>Local Preference</td><td>本地优先级，值越大越优先</td></tr>
            <tr><td>3</td><td>本地始发路由</td><td>network/aggregate 命令产生</td></tr>
            <tr><td>4</td><td>AS Path 长度</td><td>路径越短越优先</td></tr>
            <tr><td>5</td><td>Origin 类型</td><td>IGP &lt; EGP &lt; Incomplete</td></tr>
            <tr><td>6</td><td>MED（Multi-Exit Discriminator）</td><td>值越小越优先，跨 AS 传递</td></tr>
          </table>

          <div class="doc-note">
            <strong>推荐实践：</strong> 在多 ISP 出口场景中，建议使用 Local Preference 控制出站流量方向，使用 MED 或 AS Path Prepending 影响入站流量。合理搭配可实现精细化的流量工程。
          </div>

          <h2>四、网络高可用架构设计</h2>
          <h3>4.1 双活数据中心 BGP 架构</h3>
          <p>典型双活数据中心通过 BGP 实现流量负载分担与故障自动切换。每个数据中心对外通告相同的 IP 地址段，利用 BGP 选路策略实现就近接入和故障转移，避免单点故障影响业务连续性。</p>

          <h3>4.2 BFD 快速故障检测</h3>
          <p>BFD（Bidirectional Forwarding Detection）与 BGP 联动，将故障检测时间从默认的 180 秒（Hold Timer）缩短到亚秒级别，是实现网络高可用的关键技术手段。生产环境建议将 BFD 检测间隔设置为 300ms。</p>

          <h3>4.3 Graceful Restart 与 NSR</h3>
          <p>Graceful Restart 允许 BGP 对等体在控制平面重启期间保持转发平面正常工作，避免路由抖动引发全网震荡。NSR（Non-Stop Routing）进一步实现在主备引擎切换时不中断 BGP 会话，真正达到业务无感知切换。</p>

          <div class="doc-note">
            <strong>关键指标：</strong> 生产环境 BGP 收敛时间应控制在 300ms 以内（含 BFD 检测 + 路由更新 + FIB 下发），建议每月进行一次故障切换演练以验证架构可靠性。
          </div>
        </div>
      </div>
      <div class="doc-footer">
        <span>© 2026 NetTech · 面向网络工程师的技术社区</span>
        <span>京ICP备xxxxxxxx号-1</span>
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

    // (3) 摸鱼键（技术文档伪装按钮）
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
        <div class="zh-guide-item"><span><kbd>Esc</kbd></span><span>老板键 (技术文档掩护)</span></div>
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