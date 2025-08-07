#!/usr/bin/env node

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// API 端點
const REDEEM_API_URL = 'https://api.thebd2pulse.com/redeem';

// 語言配置
const LANGUAGE_CONFIG = {
  'zh-Hant-TW': {
    title: '最新兌換碼',
    noData: '目前沒有可用的兌換碼',
    error: '無法載入兌換碼資料'
  },
  'en': {
    title: 'Latest Coupon Codes',
    noData: 'No coupon codes available',
    error: 'Unable to load coupon codes'
  },
  'ja-JP': {
    title: '最新シリアルコード',
    noData: '利用可能なシリアルコードがありません',
    error: 'シリアルコードを読み込めません'
  },
  'ko-KR': {
    title: '최신 쿠폰 코드',
    noData: '사용 가능한 쿠폰 코드가 없습니다',
    error: '쿠폰 코드를 불러올 수 없습니다'
  },
  'zh-CN': {
    title: '最新兑换码',
    noData: '暂无可用兑换码',
    error: '无法加载兑换码数据'
  }
};

// HTML 檔案映射
const HTML_FILES = [
  { file: 'index.html', lang: 'zh-Hant-TW' },
  { file: 'en.html', lang: 'en' },
  { file: 'ja-JP.html', lang: 'ja-JP' },
  { file: 'ko-KR.html', lang: 'ko-KR' },
  { file: 'zh-CN.html', lang: 'zh-CN' }
];

// 獲取兌換碼數據
async function fetchRedeemCodes() {
  try {
    console.log('🔄 正在獲取兌換碼數據...');
    const response = await fetch(REDEEM_API_URL);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    console.log(`成功獲取 ${data.length} 個兌換碼`);
    return data;
  } catch (error) {
    console.error('獲取兌換碼失敗:', error.message);
    return null;
  }
}

// 生成靜態 HTML 內容
function generateStaticContent(redeemData, language) {
  const config = LANGUAGE_CONFIG[language];
  
  if (!redeemData || redeemData.length === 0) {
    return `
    <div id="static-fallback-content" style="
      padding: 20px;
      background: rgba(18, 18, 18, 0.95);
      border-radius: 12px;
      margin: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      color: #ffffff;
      font-family: 'Roboto', sans-serif;
    ">
      <h2 style="
        color: #bb86fc;
        margin-bottom: 16px;
        font-size: 1.5rem;
        font-weight: 500;
      ">${config.title}</h2>
      <p style="
        color: #e0e0e0;
        font-size: 1rem;
        margin: 0;
      ">${config.noData}</p>
    </div>`;
  }

  // 過濾有效的兌換碼（排除錯誤狀態）
  const validCodes = redeemData.filter(code => 
    code.code && 
    code.code !== 'API_ERROR' && 
    code.code !== 'LOAD_ERROR' &&
    code.code !== 'NO_DATA'
  );

  if (validCodes.length === 0) {
    return `
    <div id="static-fallback-content" style="
      padding: 20px;
      background: rgba(18, 18, 18, 0.95);
      border-radius: 12px;
      margin: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      color: #ffffff;
      font-family: 'Roboto', sans-serif;
    ">
      <h2 style="
        color: #bb86fc;
        margin-bottom: 16px;
        font-size: 1.5rem;
        font-weight: 500;
      ">${config.title}</h2>
      <p style="
        color: #e0e0e0;
        font-size: 1rem;
        margin: 0;
      ">${config.noData}</p>
    </div>`;
  }

  // 生成兌換碼列表
  const codesList = validCodes.slice(0, 10).map(code => {
    // 處理多語言獎勵文字
    let reward = code.reward || code.description || '';
    if (typeof reward === 'object' && reward !== null) {
      reward = reward[language] || reward['zh-Hant-TW'] || reward['en'] || Object.values(reward)[0] || '';
    }
    
    return `
      <li style="
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 8px;
        padding: 12px;
        margin-bottom: 8px;
        display: flex;
        justify-content: space-between;
        align-items: center;
      ">
        <div style="flex: 1;">
          <code style="
            background: rgba(187, 134, 252, 0.2);
            color: #bb86fc;
            padding: 4px 8px;
            border-radius: 4px;
            font-family: 'Courier New', monospace;
            font-weight: bold;
            font-size: 0.9rem;
          ">${code.code}</code>
          ${reward ? `<div style="
            color: #e0e0e0;
            font-size: 0.85rem;
            margin-top: 4px;
          ">${reward}</div>` : ''}
        </div>
      </li>`;
  }).join('');

  return `
    <div id="static-fallback-content" style="
      padding: 20px;
      background: rgba(18, 18, 18, 0.95);
      border-radius: 12px;
      margin: 20px;
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(10px);
      color: #ffffff;
      font-family: 'Roboto', sans-serif;
    ">
      <h2 style="
        color: #bb86fc;
        margin-bottom: 16px;
        font-size: 1.5rem;
        font-weight: 500;
      ">${config.title}</h2>
      <ul style="
        list-style: none;
        padding: 0;
        margin: 0;
      ">
        ${codesList}
      </ul>
      <div style="
        margin-top: 16px;
        font-size: 0.8rem;
        color: #9e9e9e;
        text-align: center;
      ">
        ⚡ 載入中... 完整功能即將啟用
      </div>
    </div>`;
}

// 注入靜態內容到 HTML 檔案
async function injectStaticContent(htmlFile, staticContent) {
  try {
    const filePath = join(__dirname, '..', htmlFile);
    const htmlContent = await readFile(filePath, 'utf-8');
    
    // 尋找 <div id="app"> 標籤並注入內容
    const appDivRegex = /(<div id="app">)([\s\S]*?)(<\/div>)/;
    const match = htmlContent.match(appDivRegex);
    
    if (!match) {
      console.error(`在 ${htmlFile} 中找不到 <div id="app"> 標籤`);
      return false;
    }
    
    // 替換內容，保留原有的 app div 結構
    const updatedContent = htmlContent.replace(
      appDivRegex,
      `$1\n    ${staticContent}\n  $3`
    );
    
    await writeFile(filePath, updatedContent, 'utf-8');
    console.log(`成功注入靜態內容到 ${htmlFile}`);
    return true;
  } catch (error) {
    console.error(`處理 ${htmlFile} 時發生錯誤:`, error.message);
    return false;
  }
}

// 主執行函數
async function main() {
  console.log('🚀 開始靜態內容注入流程...\n');
  
  // 獲取兌換碼數據
  const redeemData = await fetchRedeemCodes();
  
  // 為每個語言版本注入內容
  let successCount = 0;
  
  for (const { file, lang } of HTML_FILES) {
    console.log(`\n處理 ${file} (${lang})...`);
    const staticContent = generateStaticContent(redeemData, lang);
    const success = await injectStaticContent(file, staticContent);
    
    if (success) {
      successCount++;
    }
  }
  
  console.log(`\n靜態內容注入完成! 成功處理 ${successCount}/${HTML_FILES.length} 個檔案`);
  
  if (successCount === HTML_FILES.length) {
    process.exit(0);
  } else {
    process.exit(1);
  }
}

// 執行腳本
main().catch(error => {
  console.error('腳本執行失敗:', error);
  process.exit(1);
});