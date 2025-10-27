<template>
  <v-container class="about-page">
    <v-row justify="center">
      <v-col cols="12" md="8" lg="6">
        <!-- 頁面標題 -->
        <div class="page-header mb-6">
          <h1 class="page-title">{{ t('about.title') }}</h1>
          <p class="page-subtitle">{{ t('about.description') }}</p>
        </div>

        <!-- 關於內容卡片 -->
        <v-card rounded="xl" class="about-card mb-4">
          <v-card-title class="about-card-title">
            <v-icon class="mr-3" color="primary" size="24">mdi-information</v-icon>
            {{ t('about.cardTitle') }}
          </v-card-title>
          
          <v-card-text class="about-card-content">
            <div class="content-section">
              <div class="section-text">
                {{ t('about.content') }}
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- 開放原始碼卡片 -->
        <v-card rounded="xl" class="info-card mb-4">
          <v-card-title class="info-card-title">
            <v-icon class="mr-3" color="primary" size="24">mdi-source-branch</v-icon>
            {{ t('about.openSource.title') }}
          </v-card-title>
          
          <v-card-text class="info-card-content">
            <!-- GitHub -->
            <div class="info-item clickable" @click="openGitHub">
              <div class="info-label-wrapper">
                <svg class="info-icon github-icon" width="24" height="24" viewBox="0 0 98 96" xmlns="http://www.w3.org/2000/svg">
                  <path fill-rule="evenodd" clip-rule="evenodd" d="M48.854 0C21.839 0 0 22 0 49.217c0 21.756 13.993 40.172 33.405 46.69 2.427.49 3.316-1.059 3.316-2.362 0-1.141-.08-5.052-.08-9.127-13.59 2.934-16.42-5.867-16.42-5.867-2.184-5.704-5.42-7.17-5.42-7.17-4.448-3.015.324-3.015.324-3.015 4.934.326 7.523 5.052 7.523 5.052 4.367 7.496 11.404 5.378 14.235 4.074.404-3.178 1.699-5.378 3.074-6.6-10.839-1.141-22.243-5.378-22.243-24.283 0-5.378 1.94-9.778 5.014-13.2-.485-1.222-2.184-6.275.486-13.038 0 0 4.125-1.304 13.426 5.052a46.97 46.97 0 0 1 12.214-1.63c4.125 0 8.33.571 12.213 1.63 9.302-6.356 13.427-5.052 13.427-5.052 2.67 6.763.97 11.816.485 13.038 3.155 3.422 5.015 7.822 5.015 13.2 0 18.905-11.404 23.06-22.324 24.283 1.78 1.548 3.316 4.481 3.316 9.126 0 6.6-.08 11.897-.08 13.526 0 1.304.89 2.853 3.316 2.364 19.412-6.52 33.405-24.935 33.405-46.691C97.707 22 75.788 0 48.854 0z" fill="currentColor"/>
                </svg>
                <span class="info-label">{{ t('about.openSource.github') }}</span>
              </div>
              <div class="info-value">{{ t('about.openSource.viewCode') }}</div>
            </div>
            
            <!-- Figma -->
            <div class="info-item clickable" @click="openFigma">
              <div class="info-label-wrapper">
                <svg class="info-icon figma-icon" width="32" height="32" viewBox="0 0 1024 1280" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M312 840C312 784.772 356.772 740 412 740H512V840C512 895.228 467.228 940 412 940C356.772 940 312 895.228 312 840Z" fill="#24CB71"/>
                  <path d="M512 340V540H612C667.228 540 712 495.228 712 440C712 384.772 667.228 340 612 340H512Z" fill="#FF7237"/>
                  <path d="M611.167 740C666.395 740 711.167 695.228 711.167 640C711.167 584.772 666.395 540 611.167 540C555.939 540 511.167 584.772 511.167 640C511.167 695.228 555.939 740 611.167 740Z" fill="#00B6FF"/>
                  <path d="M312 440C312 495.228 356.772 540 412 540H512V340H412C356.772 340 312 384.772 312 440Z" fill="#FF3737"/>
                  <path d="M312 640C312 695.228 356.772 740 412 740H512V540H412C356.772 540 312 584.772 312 640Z" fill="#874FFF"/>
                </svg>
                <span class="info-label">{{ t('about.openSource.figma') }}</span>
              </div>
              <div class="info-value">{{ t('about.openSource.viewDesign') }}</div>
            </div>
            
            <div class="info-item">
              <div class="info-label">{{ t('about.openSource.license') }}</div>
              <div class="info-value">MIT</div>
            </div>
          </v-card-text>
        </v-card>

        <!-- 技術棧卡片 -->
        <v-card rounded="xl" class="tech-card mb-4">
          <v-card-title class="tech-card-title">
            <v-icon class="mr-3" color="primary" size="24">mdi-code-tags</v-icon>
            {{ t('about.techStack.title') }}
          </v-card-title>
          
          <v-card-text class="tech-card-content">
            <div class="tech-grid">
              <div class="tech-item">
                <div class="tech-icon">⚛️</div>
                <div class="tech-name">Vue 3</div>
              </div>
              <div class="tech-item">
                <div class="tech-icon">📦</div>
                <div class="tech-name">Vite</div>
              </div>
              <div class="tech-item">
                <div class="tech-icon">🎨</div>
                <div class="tech-name">Vuetify 3</div>
              </div>
              <div class="tech-item">
                <div class="tech-icon">🗂️</div>
                <div class="tech-name">Pinia</div>
              </div>
            </div>
          </v-card-text>
        </v-card>

        <!-- 贊助報表卡片 -->
        <v-card rounded="xl" class="report-card">
          <v-card-title class="report-card-title">
            <v-icon class="mr-3" color="primary" size="24">mdi-chart-box</v-icon>
            {{ t('about.sponsorshipReport.title') }}
          </v-card-title>
          
          <v-card-text class="report-card-content">
            <div class="report-description mb-4">
              {{ t('about.sponsorshipReport.description') }}
            </div>
            
            <!-- 打開完整報表的按鈕 -->
            <div class="report-actions mb-4">
              <v-btn
                @click="openFullReport"
                color="primary"
                variant="outlined"
                size="small"
                class="mr-2"
              >
                <v-icon size="16" class="mr-2">mdi-open-in-new</v-icon>
                {{ t('about.sponsorshipReport.openFull') }}
              </v-btn>
              
              <v-btn
                @click="copyReportUrl"
                color="secondary"
                variant="text"
                size="small"
                v-if="copySuccess"
              >
                <v-icon size="16" class="mr-2">mdi-check</v-icon>
                {{ t('about.sponsorshipReport.copied') }}
              </v-btn>
              
              <v-btn
                @click="copyReportUrl"
                color="secondary"
                variant="text"
                size="small"
                v-else
              >
                <v-icon size="16" class="mr-2">mdi-link-variant</v-icon>
                {{ t('about.sponsorshipReport.copyUrl') }}
              </v-btn>
            </div>
            
            <div class="report-iframe-container">
              <iframe
                :id="`sponsorship-report-${settingsStore.selectedLanguage}`"
                :src="lookerStudioUrl"
                frameborder="0"
                style="border:0;"
                allowfullscreen
                class="report-iframe"
                loading="lazy"
                sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                :title="t('about.sponsorshipReport.title')"
              ></iframe>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import { useSettingsStore } from '@/stores/settings'

export default {
  name: "AboutPage",
  setup() {
    const settingsStore = useSettingsStore()
    return { settingsStore }
  },
  data() {
    return {
      copySuccess: false
    }
  },
  computed: {
    // 多語言文字
    t() {
      return (key, params) => this.$t(key, this.settingsStore.selectedLanguage, params);
    },
    
    // Looker Studio 報表 URL（嵌入版本）
    lookerStudioUrl() {
      const reportId = 'f7c2efb0-d1a7-4f3b-8db6-c77af20cdd5a';
      const pageIds = {
        'zh-Hant-TW': 'YTdXF',
        'zh-Hans-CN': 'p_7gyadsyjxd',
        'en': 'p_zviro8xjxd',
        'ja-JP': 'p_4pc7yqyjxd',
        'ko-KR': 'p_7llixryjxd'
      };
      
      const pageId = pageIds[this.settingsStore.selectedLanguage] || pageIds['zh-Hant-TW'];
      // 添加 :showVizHome=n 參數隱藏導覽列
      return `https://lookerstudio.google.com/embed/reporting/${reportId}/page/${pageId}?:showVizHome=n`;
    },
    
    // 完整報表 URL（新視窗打開用）
    fullReportUrl() {
      const reportId = 'f7c2efb0-d1a7-4f3b-8db6-c77af20cdd5a';
      const pageIds = {
        'zh-Hant-TW': 'YTdXF',
        'zh-Hans-CN': 'p_7gyadsyjxd',
        'en': 'p_zviro8xjxd',
        'ja-JP': 'p_4pc7yqyjxd',
        'ko-KR': 'p_7llixryjxd'
      };
      
      const pageId = pageIds[this.settingsStore.selectedLanguage] || pageIds['zh-Hant-TW'];
      return `https://lookerstudio.google.com/u/0/reporting/${reportId}/page/${pageId}`;
    }
  },
  methods: {
    // 在新分頁打開完整報表
    openFullReport() {
      window.open(this.fullReportUrl, '_blank', 'noopener,noreferrer');
    },
    
    // 複製報表 URL
    async copyReportUrl() {
      try {
        await navigator.clipboard.writeText(this.fullReportUrl);
        this.copySuccess = true;
        setTimeout(() => {
          this.copySuccess = false;
        }, 2000);
      } catch (error) {
        console.error('複製失敗:', error);
      }
    },
    
    // 打開 GitHub
    openGitHub() {
      window.open('https://github.com/rm6alalauau/BD2-Archive', '_blank', 'noopener,noreferrer');
    },
    
    // 打開 Figma
    openFigma() {
      window.open('https://www.figma.com/community/file/1441663496302710815/zzz-archive', '_blank', 'noopener,noreferrer');
    }
  },
  mounted() {
    // 確保設定已載入
    if (!this.settingsStore.isLoaded) {
      this.settingsStore.loadSettings();
    }
  },
};
</script>

<style scoped>
.about-page {
  min-height: calc(100vh - 64px);
  padding-top: 32px;
  padding-bottom: 32px;
}

/* 頁面標題 */
.page-header {
  text-align: center;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #e72857;
  margin-bottom: 8px;
}

.page-subtitle {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.7);
  margin: 0;
}

/* 關於卡片 */
.about-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
}

.about-card-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  padding: 24px 24px 0 24px;
}

.about-card-content {
  padding: 24px;
}

.content-section {
  margin-bottom: 16px;
}

.section-text {
  font-size: 0.95rem;
  line-height: 1.8;
  color: rgba(255, 255, 255, 0.85);
  text-align: justify;
  text-justify: inter-ideograph;
}

/* 資訊卡片 */
.info-card,
.tech-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
}

.info-card-title,
.tech-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  padding: 24px 24px 16px 24px;
}

.info-card-content {
  padding: 0 24px 24px 24px;
}

.info-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.info-item:last-child {
  border-bottom: none;
}

.info-item.clickable {
  cursor: pointer;
  transition: all 0.2s ease;
  border-radius: 8px;
  padding: 12px 8px;
  margin: 0 -8px;
}

.info-item.clickable:hover {
  background: rgba(255, 255, 255, 0.05);
}

.info-label-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
}

.info-icon {
  color: rgba(255, 255, 255, 0.7);
  flex-shrink: 0;
}

.github-icon {
  width: 32px;
  height: 24px;
}

.figma-icon {
  width: 32px;
  height: 32px;
}

.info-label {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.7);
  font-weight: 500;
}

.info-value {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
}

/* 技術棧 */
.tech-card-content {
  padding: 0 24px 24px 24px;
}

/* 報表卡片 */
.report-card {
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.02) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  backdrop-filter: blur(10px);
}

.report-card-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.9);
  padding: 24px 24px 16px 24px;
}

.report-card-content {
  padding: 24px;
}

.report-description {
  font-size: 0.9rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.75);
  text-align: center;
}

.report-actions {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
}

.report-iframe-container {
  position: relative;
  width: 100%;
  padding-bottom: 75%; /* 4:3 比例 */
  overflow: hidden;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.report-iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border-radius: 12px;
}

.tech-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.tech-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  padding: 20px;
  text-align: center;
  transition: all 0.3s ease;
}

.tech-item:hover {
  background: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.15);
  transform: translateY(-2px);
}

.tech-icon {
  font-size: 2rem;
  margin-bottom: 8px;
}

.tech-name {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 500;
}

/* 響應式設計 */
@media (max-width: 768px) {
  .page-title {
    font-size: 1.75rem;
  }
  
  .about-card-title,
  .info-card-title,
  .tech-card-title,
  .report-card-title {
    padding: 20px 20px 0 20px;
    font-size: 1rem;
  }
  
  .about-card-content,
  .info-card-content,
  .tech-card-content,
  .report-card-content {
    padding: 20px !important;
  }
  
  .tech-grid {
    grid-template-columns: 1fr;
  }
  
  .report-iframe-container {
    padding-bottom: 56.25%; /* 16:9 比例（手機版） */
  }
}

@media (max-width: 480px) {
  .about-page {
    padding-top: 16px;
  }
  
  .page-title {
    font-size: 1.5rem;
  }
}
</style>

