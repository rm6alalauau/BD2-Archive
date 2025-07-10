// Cloudinary圖片優化工具
const CLOUDINARY_CLOUD_NAME = 'daifne7zq';
const CLOUDINARY_TRANSFORMATION = 'w_800,f_auto,q_auto';
const CLOUDINARY_SMALL_TRANSFORMATION = 'w_160,h_160,c_fit,f_auto,q_auto';

/**
 * 將圖片URL轉換為Cloudinary優化版本
 * @param {string} imageUrl - 原始圖片URL
 * @returns {string} - Cloudinary優化後的URL
 */
export function optimizeImageUrl(imageUrl) {
  if (!imageUrl) return '';
  
  // 如果已經是Cloudinary URL，直接返回
  if (imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }
  
  // 如果URL是相對路徑，轉換為完整URL
  let fullUrl = imageUrl;
  if (imageUrl.startsWith('/')) {
    fullUrl = `https://www.browndust2.com${imageUrl}`;
  } else if (imageUrl.startsWith('http')) {
    fullUrl = imageUrl;
  } else {
    fullUrl = `https://www.browndust2.com/${imageUrl}`;
  }
  
  // 構建Cloudinary fetch URL
  const encodedUrl = encodeURIComponent(fullUrl);
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/${CLOUDINARY_TRANSFORMATION}/${encodedUrl}`;
}

/**
 * 獲取小尺寸的Cloudinary優化圖片URL（適用於Naver等組件）
 * @param {string} imageUrl - 原始圖片URL
 * @returns {string} - Cloudinary優化後的URL
 */
export function getSmallOptimizedImageUrl(imageUrl) {
  if (!imageUrl) return '';
  
  // 如果已經是Cloudinary URL，直接返回
  if (imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }
  
  // 如果URL是相對路徑，轉換為完整URL
  let fullUrl = imageUrl;
  if (imageUrl.startsWith('/')) {
    fullUrl = `https://www.browndust2.com${imageUrl}`;
  } else if (imageUrl.startsWith('http')) {
    fullUrl = imageUrl;
  } else {
    fullUrl = `https://www.browndust2.com/${imageUrl}`;
  }
  
  // 構建Cloudinary fetch URL，使用WebP格式和更小的尺寸
  const encodedUrl = encodeURIComponent(fullUrl);
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/${CLOUDINARY_SMALL_TRANSFORMATION}/${encodedUrl}`;
}

/**
 * 獲取不同尺寸的Cloudinary優化圖片URL
 * @param {string} imageUrl - 原始圖片URL
 * @param {string} transformation - 自定義轉換參數
 * @returns {string} - Cloudinary優化後的URL
 */
export function getOptimizedImageUrl(imageUrl, transformation = CLOUDINARY_TRANSFORMATION) {
  if (!imageUrl) return '';
  
  // 如果已經是Cloudinary URL，直接返回
  if (imageUrl.includes('cloudinary.com')) {
    return imageUrl;
  }
  
  // 如果URL是相對路徑，轉換為完整URL
  let fullUrl = imageUrl;
  if (imageUrl.startsWith('/')) {
    fullUrl = `https://www.browndust2.com${imageUrl}`;
  } else if (imageUrl.startsWith('http')) {
    fullUrl = imageUrl;
  } else {
    fullUrl = `https://www.browndust2.com/${imageUrl}`;
  }
  
  // 構建Cloudinary fetch URL
  const encodedUrl = encodeURIComponent(fullUrl);
  return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/fetch/${transformation}/${encodedUrl}`;
}

/**
 * 獲取響應式圖片URL（用於不同螢幕尺寸）
 * @param {string} imageUrl - 原始圖片URL
 * @param {number} width - 圖片寬度
 * @returns {string} - Cloudinary響應式優化後的URL
 */
export function getResponsiveImageUrl(imageUrl, width = 800) {
  const transformation = `w_${width},f_auto,q_auto`;
  return getOptimizedImageUrl(imageUrl, transformation);
} 