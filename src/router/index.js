/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composables
import { createRouter, createWebHistory } from 'vue-router'
import { setupLayouts } from 'virtual:generated-layouts'
import { routes } from 'vue-router/auto-routes'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: setupLayouts(routes),
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

// 動態更新 canonical 標籤
router.afterEach((to, from) => {
  // 組成完整的、帶有斜線的標準 URL
  const canonicalUrl = `https://thebd2pulse.com${to.path}`;

  // 確保 URL 結尾有斜線 (對於首頁以外的頁面)
  // 這段邏輯可以根據您的路由結構調整
  const finalUrl = (to.path !== '/' && !canonicalUrl.endsWith('/')) 
                    ? `${canonicalUrl}/` 
                    : canonicalUrl;

  // 找到 canonical link 標籤並更新它的 href
  let link = document.getElementById('canonical-link');
  if (link) {
    link.setAttribute('href', finalUrl);
  } else {
    // 如果標籤不存在，就動態創建一個
    link = document.createElement('link');
    link.setAttribute('rel', 'canonical');
    link.setAttribute('id', 'canonical-link');
    link.setAttribute('href', finalUrl);
    document.head.appendChild(link);
  }
});

export default router
