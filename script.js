import dayjs from 'dayjs';

// ============================================================
// I18n — multi-language dictionary
// ============================================================

/** @type {Record<string, Record<string, string>>} */
const I18N_DICT = {
  'zh-CN': {
    hero_title: 'Telegram 图床',
    hero_desc: '基于 Telegram Bot API 的免费图床服务，快速上传并分享你的图片与视频。',
    get_started: '开始使用',
    upload_hint: '拖拽文件到此处或点击上传',
    upload_limit: '单个文件最大 50 MB',
    gallery_title: '上传记录',
    clear_history: '清除记录',
    gallery_empty: '暂无上传记录',
    settings_title: '设置',
    label_bot_token: 'Bot Token',
    hint_bot_token: '通过 @BotFather 获取你的 Bot Token',
    label_chat_id: 'Chat ID',
    hint_chat_id: '频道用户名或数字 ID，Bot 需为该频道管理员',
    label_template: '上传文件名模板',
    label_worker_url: 'Worker 代理地址',
    hint_worker_url: '可选。Cloudflare Worker 代理地址，用于隐藏文件链接中的 Bot Token',
    hint_template: '',
    cancel: '取消',
    save: '保存',
    close: '关闭',
    copy_url: '复制链接',
    delete_record: '删除',
    toast_config_saved: '配置已保存',
    toast_upload_success: '上传成功',
    toast_upload_error: '上传失败',
    toast_url_copied: '链接已复制',
    toast_history_cleared: '记录已清除',
    toast_file_too_large: '文件大小超出限制（最大 50 MB）',
    toast_no_config: '请先配置 Bot Token 和 Chat ID',
    toast_config_invalid: '配置无效，请检查后重试',
    toast_network_error: '网络错误，请检查连接后重试',
    uploading: '上传中',
  },
  en: {
    hero_title: 'Telegram Image Hosting',
    hero_desc: 'Free image hosting powered by Telegram Bot API. Upload and share images instantly.',
    get_started: 'Get Started',
    upload_hint: 'Drop files here or click to upload',
    upload_limit: 'Max 50 MB per file',
    gallery_title: 'Upload History',
    clear_history: 'Clear History',
    gallery_empty: 'No uploads yet',
    settings_title: 'Settings',
    label_bot_token: 'Bot Token',
    hint_bot_token: 'Get your token from @BotFather on Telegram',
    label_chat_id: 'Chat ID',
    hint_chat_id: 'Channel username or numeric ID. The bot must be an admin of the channel.',
    label_template: 'Upload Filename Template',
    label_worker_url: 'Worker Proxy URL',
    hint_worker_url: 'Optional. Cloudflare Worker proxy URL to hide Bot Token from file links',
    hint_template: '',
    cancel: 'Cancel',
    save: 'Save',
    close: 'Close',
    copy_url: 'Copy URL',
    delete_record: 'Delete',
    toast_config_saved: 'Configuration saved',
    toast_upload_success: 'Upload complete',
    toast_upload_error: 'Upload failed',
    toast_url_copied: 'URL copied to clipboard',
    toast_history_cleared: 'History cleared',
    toast_file_too_large: 'File exceeds the 50 MB limit',
    toast_no_config: 'Please configure Bot Token and Chat ID first',
    toast_config_invalid: 'Invalid configuration. Please check and try again.',
    toast_network_error: 'Network error. Please check your connection.',
    uploading: 'Uploading',
  },
  ja: {
    hero_title: 'Telegram 画像ホスティング',
    hero_desc: 'Telegram Bot API を利用した無料画像ホスティング。画像や動画を素早くアップロードして共有。',
    get_started: 'はじめる',
    upload_hint: 'ファイルをドロップするかクリックしてアップロード',
    upload_limit: '最大 50 MB / ファイル',
    gallery_title: 'アップロード履歴',
    clear_history: '履歴を消去',
    gallery_empty: 'まだアップロードがありません',
    settings_title: '設定',
    label_bot_token: 'Bot Token',
    hint_bot_token: '@BotFather からトークンを取得してください',
    label_chat_id: 'Chat ID',
    hint_chat_id: 'チャンネルのユーザー名または数値ID。Botがチャンネル管理者である必要があります。',
    label_template: 'ファイル名テンプレート',
    label_worker_url: 'Worker プロキシURL',
    hint_worker_url: 'オプション。ファイルリンクからBot Tokenを隠すためのCloudflare WorkerプロキシURL',
    hint_template: '',
    cancel: 'キャンセル',
    save: '保存',
    close: '閉じる',
    copy_url: 'URLをコピー',
    delete_record: '削除',
    toast_config_saved: '設定を保存しました',
    toast_upload_success: 'アップロード完了',
    toast_upload_error: 'アップロード失敗',
    toast_url_copied: 'URLをコピーしました',
    toast_history_cleared: '履歴を消去しました',
    toast_file_too_large: 'ファイルサイズが制限を超えています（最大 50 MB）',
    toast_no_config: 'Bot Token と Chat ID を設定してください',
    toast_config_invalid: '設定が無効です。確認して再試行してください。',
    toast_network_error: 'ネットワークエラー。接続を確認してください。',
    uploading: 'アップロード中',
  },
};

class I18n {
  /** @param {string} lang */
  constructor(lang = 'zh-CN') {
    /** @type {string} */
    this.lang = I18N_DICT[lang] ? lang : 'zh-CN';
  }

  /** @param {string} key @returns {string} */
  t(key) {
    return I18N_DICT[this.lang]?.[key] ?? I18N_DICT['en']?.[key] ?? key;
  }

  /** @param {string} lang */
  setLang(lang) {
    if (I18N_DICT[lang]) {
      this.lang = lang;
      document.documentElement.lang = lang;
      this.#updateDOM();
    }
  }

  #updateDOM() {
    document.querySelectorAll('[data-i18n]').forEach((el) => {
      const key = el.dataset.i18n;
      if (key && key !== 'hint_template') {
        el.textContent = this.t(key);
      }
    });
  }
}

// ============================================================
// ConfigManager — localStorage-backed settings
// ============================================================

class ConfigManager {
  constructor() {
    /** @type {string} */ this.STORAGE_KEY = 'tg_image_config';
  }

  /** @returns {{ token: string, chatId: string, lang: string, theme: string, template: string }} */
  getAll() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) return JSON.parse(raw);
    } catch { /* corrupted data */ }
    return { token: '', chatId: '', lang: 'zh-CN', theme: 'light', template: '[name]_[hash:6].[ext]', workerUrl: '' };
  }

  /** @param {Partial<ReturnType<ConfigManager['getAll']>>} partial */
  save(partial) {
    const current = this.getAll();
    const next = { ...current, ...partial };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(next));
  }

  get token() { return this.getAll().token; }
  set token(v) { this.save({ token: v }); }
  get chatId() { return this.getAll().chatId; }
  set chatId(v) { this.save({ chatId: v }); }
  get lang() { return this.getAll().lang; }
  get theme() { return this.getAll().theme; }
  get template() { return this.getAll().template; }
  get workerUrl() { return this.getAll().workerUrl; }
  get isConfigured() { return !!(this.token && this.chatId); }
}

// ============================================================
// ThemeManager — light/dark mode
// ============================================================

class ThemeManager {
  /** @param {ConfigManager} config */
  constructor(config) {
    /** @type {ConfigManager} */ this.config = config;
  }

  init() {
    this.#apply(this.config.theme);
  }

  /** @param {'light'|'dark'} theme */
  #apply(theme) {
    const toggle = () => {
      document.documentElement.dataset.theme = theme;
    };
    if (document.startViewTransition) {
      document.startViewTransition(toggle);
    } else {
      toggle();
    }
  }

  toggle() {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    this.#apply(next);
    this.config.save({ theme: next });
  }

  /** @param {'light'|'dark'} theme */
  set(theme) {
    this.#apply(theme);
    this.config.save({ theme });
  }
}

// ============================================================
// TemplateEngine — process filename templates
// ============================================================

class TemplateEngine {
  /**
   * @param {File} file
   * @param {string} template
   * @returns {Promise<string>}
   */
  async process(file, template) {
    let result = template;

    const baseName = file.name.replace(/\.[^.]+$/, '');
    const ext = (file.name.split('.').pop() || '').toLowerCase();

    result = result.replace(/\[name\]/g, baseName);
    result = result.replace(/\[ext\]/g, ext);

    result = result.replace(/\[date:([^\]]+)\]/g, (_, fmt) => dayjs().format(fmt));

    const hashRe = /\[hash:(\d+)\]/g;
    let hashMatch;
    const hashReplacements = [];
    while ((hashMatch = hashRe.exec(result)) !== null) {
      hashReplacements.push({ placeholder: hashMatch[0], length: parseInt(hashMatch[1], 10) });
    }
    if (hashReplacements.length > 0) {
      const fileBuffer = await file.arrayBuffer();
      const hashBuffer = await crypto.subtle.digest('SHA-256', fileBuffer);
      const hashHex = Array.from(new Uint8Array(hashBuffer), b => b.toString(16).padStart(2, '0')).join('');
      for (const r of hashReplacements) {
        result = result.replace(r.placeholder, hashHex.substring(0, r.length));
      }
    }

    result = result.replace(/\[timestamp\]/g, Math.floor(Date.now() / 1000).toString());
    result = result.replace(/\[uuid\]/g, crypto.randomUUID());

    return result;
  }
}

// ============================================================
// TelegramClient — Bot API wrapper
// ============================================================

const PHOTO_SIZE_LIMIT = 10 * 1024 * 1024;
const MAX_FILE_SIZE = 50 * 1024 * 1024;

/**
 * @param {File} file
 * @returns {'sendPhoto'|'sendVideo'|'sendDocument'}
 */
function getUploadMethod(file) {
  const t = file.type;
  if (t.startsWith('image/') && t !== 'image/svg+xml' && file.size <= PHOTO_SIZE_LIMIT) {
    return 'sendPhoto';
  }
  if (t.startsWith('video/') && file.size <= MAX_FILE_SIZE) {
    return 'sendVideo';
  }
  return 'sendDocument';
}

class TelegramClient {
  /** @param {string} token @param {string} chatId */
  constructor(token, chatId) {
    this.token = token;
    this.chatId = chatId;
  }

  get baseUrl() {
    return `https://api.telegram.org/bot${this.token}`;
  }

  /**
   * Upload a file to Telegram.
   * @param {File} file
   * @param {string} generatedName — template-processed filename
   * @returns {Promise<{ url: string, filePath: string, fileId: string, messageId: number }>}
   */
  async upload(file, generatedName) {
    const method = getUploadMethod(file);
    const formData = new FormData();
    formData.append('chat_id', this.chatId);

    const fileNamePart = generatedName.split('/').pop() || generatedName;

    if (method === 'sendPhoto') {
      formData.append('photo', file, fileNamePart);
      formData.append('caption', generatedName);
    } else if (method === 'sendVideo') {
      formData.append('video', file, fileNamePart);
      formData.append('caption', generatedName);
    } else {
      formData.append('document', file, fileNamePart);
      formData.append('caption', generatedName);
    }

    const url = `${this.baseUrl}/${method}`;
    const res = await fetch(url, { method: 'POST', body: formData });

    if (!res.ok) {
      let description = `HTTP ${res.status}`;
      try {
        const errData = await res.json();
        if (errData.description) description = errData.description;
      } catch { /* ignore parse errors */ }
      throw new Error(`Telegram API error: ${description}`);
    }

    const sendResult = await res.json();

    if (!sendResult.ok) {
      throw new Error(`Telegram API error: ${sendResult.description || 'Unknown error'}`);
    }

    const result = sendResult.result;
    let fileId = '';

    if (method === 'sendPhoto' && result.photo?.length) {
      fileId = result.photo[result.photo.length - 1].file_id;
    } else if (method === 'sendVideo' && result.video) {
      fileId = result.video.file_id;
    } else if (result.document) {
      fileId = result.document.file_id;
    }

    if (!fileId) {
      throw new Error('Could not extract file_id from Telegram response');
    }

    const { url: fileUrl, filePath } = await this.getFileUrl(fileId);
    return { url: fileUrl, filePath, fileId, messageId: result.message_id };
  }

  /**
   * Resolve a file_id to a public URL and file path.
   * @param {string} fileId
   * @returns {Promise<{ url: string, filePath: string }>}
   */
  async getFileUrl(fileId) {
    const res = await fetch(`${this.baseUrl}/getFile?file_id=${encodeURIComponent(fileId)}`);
    const data = await res.json();
    if (!data.ok || !data.result?.file_path) {
      throw new Error('Failed to resolve file URL');
    }
    return {
      url: `https://api.telegram.org/file/bot${this.token}/${data.result.file_path}`,
      filePath: data.result.file_path,
    };
  }
}

// ============================================================
// HistoryManager — upload records in localStorage
// ============================================================

/**
 * @typedef {{ id: string, name: string, url: string, filePath: (string|undefined), fileType: string, fileSize: number, uploadedAt: number, messageId: number }} UploadRecord
 */

class HistoryManager {
  constructor() {
    this.STORAGE_KEY = 'tg_image_history';
  }

  /** @returns {UploadRecord[]} */
  getAll() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  /** @param {UploadRecord} record */
  add(record) {
    const list = this.getAll();
    list.unshift(record);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list.slice(0, 200)));
  }

  /** @param {string} id */
  remove(id) {
    const list = this.getAll().filter(r => r.id !== id);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(list));
  }

  clear() {
    localStorage.removeItem(this.STORAGE_KEY);
  }
}

// ============================================================
// Toast — notification system
// ============================================================

class Toast {
  constructor() {
    /** @type {HTMLElement} */
    this.container = document.getElementById('toast-container');
  }

  /**
   * @param {string} message
   * @param {'success'|'error'|'info'} type
   */
  show(message, type = 'info') {
    const el = document.createElement('div');
    el.className = `toast toast-${type}`;
    el.textContent = message;
    this.container.appendChild(el);

    const remove = () => {
      el.classList.add('removing');
      setTimeout(() => el.remove(), 200);
    };

    setTimeout(remove, 3000);
    el.addEventListener('click', remove);
  }
}

// ============================================================
// App — main application controller
// ============================================================

class App {
  constructor() {
    /** @type {ConfigManager} */   this.config = new ConfigManager();
    /** @type {I18n} */            this.i18n = new I18n(this.config.lang);
    /** @type {ThemeManager} */    this.theme = new ThemeManager(this.config);
    /** @type {TemplateEngine} */  this.templateEngine = new TemplateEngine();
    /** @type {HistoryManager} */  this.history = new HistoryManager();
    /** @type {Toast} */           this.toast = new Toast();

    /** @type {HTMLSelectElement} */   this.selectLang = document.getElementById('select-lang');
    /** @type {HTMLButtonElement} */   this.btnTheme = document.getElementById('btn-theme');
    /** @type {HTMLButtonElement} */   this.btnSettings = document.getElementById('btn-settings');
    /** @type {HTMLButtonElement} */   this.btnGetStarted = document.getElementById('btn-get-started');
    /** @type {HTMLElement} */         this.heroSection = document.getElementById('hero-section');
    /** @type {HTMLElement} */         this.uploadSection = document.getElementById('upload-section');
    /** @type {HTMLElement} */         this.gallerySection = document.getElementById('gallery-section');
    /** @type {HTMLElement} */         this.uploadZone = document.getElementById('upload-zone');
    /** @type {HTMLInputElement} */    this.fileInput = document.getElementById('file-input');
    /** @type {HTMLElement} */         this.uploadProgress = document.getElementById('upload-progress');
    /** @type {HTMLElement} */         this.progressFill = document.getElementById('progress-fill');
    /** @type {HTMLElement} */         this.progressText = document.getElementById('progress-text');
    /** @type {HTMLElement} */         this.galleryGrid = document.getElementById('gallery-grid');
    /** @type {HTMLElement} */         this.galleryEmpty = document.getElementById('gallery-empty');
    /** @type {HTMLDialogElement} */   this.settingsDialog = document.getElementById('settings-dialog');
    /** @type {HTMLFormElement} */     this.settingsForm = document.getElementById('settings-form');
    /** @type {HTMLInputElement} */    this.inputToken = document.getElementById('bot-token');
    /** @type {HTMLInputElement} */    this.inputChatId = document.getElementById('chat-id');
    /** @type {HTMLInputElement} */    this.inputTemplate = document.getElementById('upload-template');
    /** @type {HTMLInputElement} */    this.inputWorkerUrl = document.getElementById('worker-url');
    /** @type {HTMLDialogElement} */   this.previewDialog = document.getElementById('preview-dialog');
    /** @type {HTMLElement} */         this.previewName = document.getElementById('preview-name');
    /** @type {HTMLElement} */         this.previewBody = document.getElementById('preview-body');
    /** @type {HTMLButtonElement} */   this.btnCopyUrl = document.getElementById('btn-copy-url');
    /** @type {HTMLButtonElement} */   this.btnClearHistory = document.getElementById('btn-clear-history');

    /** @type {string|null} */ this.currentPreviewUrl = null;
  }

  init() {
    this.theme.init();
    this.i18n.setLang(this.config.lang);

    this.#bindEvents();
    this.#render();
  }

  #bindEvents() {
    this.btnTheme.addEventListener('click', () => this.theme.toggle());

    this.selectLang.addEventListener('change', () => {
      this.i18n.setLang(this.selectLang.value);
      this.config.save({ lang: this.selectLang.value });
    });

    this.btnSettings.addEventListener('click', () => this.#openSettings());
    this.btnGetStarted.addEventListener('click', () => this.#openSettings());

    this.settingsForm.addEventListener('submit', (e) => {
      e.preventDefault();
      this.#saveSettings();
    });

    document.querySelectorAll('[data-close-dialog]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const dialog = btn.closest('dialog');
        if (dialog) dialog.close();
      });
    });

    this.settingsDialog.addEventListener('click', (e) => {
      if (e.target === this.settingsDialog) this.settingsDialog.close();
    });

    this.previewDialog.addEventListener('click', (e) => {
      if (e.target === this.previewDialog) this.previewDialog.close();
    });

    this.uploadZone.addEventListener('click', () => {
      if (this.config.isConfigured) this.fileInput.click();
    });

    this.uploadZone.addEventListener('keydown', (e) => {
      if ((e.key === 'Enter' || e.key === ' ') && this.config.isConfigured) {
        e.preventDefault();
        this.fileInput.click();
      }
    });

    this.fileInput.addEventListener('change', () => {
      if (this.fileInput.files?.length) {
        this.#handleFiles(Array.from(this.fileInput.files));
        this.fileInput.value = '';
      }
    });

    this.uploadZone.addEventListener('dragover', (e) => {
      e.preventDefault();
      if (this.config.isConfigured) this.uploadZone.classList.add('drag-over');
    });

    this.uploadZone.addEventListener('dragleave', () => {
      this.uploadZone.classList.remove('drag-over');
    });

    this.uploadZone.addEventListener('drop', (e) => {
      e.preventDefault();
      this.uploadZone.classList.remove('drag-over');
      if (!this.config.isConfigured) {
        this.toast.show(this.i18n.t('toast_no_config'), 'error');
        return;
      }
      if (e.dataTransfer?.files?.length) {
        this.#handleFiles(Array.from(e.dataTransfer.files));
      }
    });

    document.addEventListener('paste', (e) => {
      if (!this.config.isConfigured) return;
      if (e.clipboardData?.files?.length) {
        e.preventDefault();
        this.#handleFiles(Array.from(e.clipboardData.files));
      }
    });

    this.btnClearHistory.addEventListener('click', () => {
      this.history.clear();
      this.toast.show(this.i18n.t('toast_history_cleared'), 'success');
      this.#renderGallery();
    });

    this.btnCopyUrl.addEventListener('click', () => {
      if (this.currentPreviewUrl) {
        navigator.clipboard.writeText(this.currentPreviewUrl).then(() => {
          this.toast.show(this.i18n.t('toast_url_copied'), 'success');
        });
      }
    });
  }

  // ---- Render ----

  #render() {
    const cfg = this.config;
    this.selectLang.value = cfg.lang;

    if (cfg.isConfigured) {
      this.heroSection.hidden = true;
      this.uploadSection.hidden = false;
      this.gallerySection.hidden = false;
    } else {
      this.heroSection.hidden = false;
      this.uploadSection.hidden = true;
      this.gallerySection.hidden = true;
    }

    this.#renderGallery();
  }

  #renderGallery() {
    const records = this.history.getAll();
    this.galleryEmpty.hidden = records.length > 0;

    const existingCards = this.galleryGrid.querySelectorAll('.gallery-card');
    existingCards.forEach(c => c.remove());

    records.forEach((rec) => {
      const card = this.#createGalleryCard(rec);
      this.galleryGrid.appendChild(card);
    });
  }

  /**
   * @param {UploadRecord} rec
   * @returns {HTMLElement}
   */
  #createGalleryCard(rec) {
    const card = document.createElement('div');
    card.className = 'gallery-card';

    const displayUrl = this.#getDisplayUrl(rec);
    const isVideo = rec.fileType.startsWith('video/');
    const thumb = isVideo
      ? `<div class="gallery-card-thumb" style="display:flex;align-items:center;justify-content:center;color:var(--color-text-tertiary)">
           <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><polygon points="5 3 19 12 5 21 5 3"/></svg>
         </div>`
      : `<img class="gallery-card-thumb" src="${this.#escapeHtml(displayUrl)}" alt="${this.#escapeHtml(rec.name)}" loading="lazy">`;

    const dateStr = dayjs(rec.uploadedAt).format('YYYY-MM-DD HH:mm');

    card.innerHTML = `
      ${thumb}
      <div class="gallery-card-body">
        <div class="gallery-card-name" title="${this.#escapeHtml(rec.name)}">${this.#escapeHtml(rec.name)}</div>
        <div class="gallery-card-meta">
          <span class="gallery-card-date">${dateStr}</span>
          <div class="gallery-card-actions">
            <button class="btn-icon" data-action="copy" title="${this.i18n.t('copy_url')}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/></svg>
            </button>
            <button class="btn-icon" data-action="delete" title="${this.i18n.t('delete_record')}">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"/></svg>
            </button>
          </div>
        </div>
      </div>`;

    card.addEventListener('click', (e) => {
      const target = /** @type {HTMLElement} */ (e.target);
      if (target.closest('[data-action="copy"]')) {
        e.stopPropagation();
        navigator.clipboard.writeText(displayUrl).then(() => {
          this.toast.show(this.i18n.t('toast_url_copied'), 'success');
        });
        return;
      }
      if (target.closest('[data-action="delete"]')) {
        e.stopPropagation();
        this.history.remove(rec.id);
        this.#renderGallery();
        return;
      }
      this.#openPreview(rec);
    });

    return card;
  }

  /** @param {string} str @returns {string} */
  #escapeHtml(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  }

  /**
   * Build the public URL for a record. Uses Worker proxy if configured,
   * otherwise falls back to the direct Telegram URL.
   * @param {UploadRecord} rec
   * @returns {string}
   */
  #getDisplayUrl(rec) {
    if (this.config.workerUrl && rec.filePath) {
      const base = this.config.workerUrl.replace(/\/+$/, '');
      return `${base}/file/${rec.filePath}`;
    }
    return rec.url;
  }

  // ---- Settings ----

  #openSettings() {
    this.inputToken.value = this.config.token;
    this.inputChatId.value = this.config.chatId;
    this.inputTemplate.value = this.config.template;
    this.inputWorkerUrl.value = this.config.workerUrl;
    this.settingsDialog.showModal();
  }

  #saveSettings() {
    const token = this.inputToken.value.trim();
    const chatId = this.inputChatId.value.trim();
    const template = this.inputTemplate.value.trim() || '[name]_[hash:6].[ext]';
    const workerUrl = this.inputWorkerUrl.value.trim();

    if (!token || !chatId) {
      this.toast.show(this.i18n.t('toast_no_config'), 'error');
      return;
    }

    this.config.save({ token, chatId, template, workerUrl });
    this.settingsDialog.close();
    this.toast.show(this.i18n.t('toast_config_saved'), 'success');
    this.#render();
  }

  // ---- Upload ----

  /**
   * @param {File[]} files
   */
  async #handleFiles(files) {
    if (!this.config.isConfigured) {
      this.toast.show(this.i18n.t('toast_no_config'), 'error');
      return;
    }

    for (const file of files) {
      if (file.size > MAX_FILE_SIZE) {
        this.toast.show(this.i18n.t('toast_file_too_large'), 'error');
        continue;
      }
      await this.#uploadFile(file);
    }
  }

  /**
   * @param {File} file
   */
  async #uploadFile(file) {
    this.uploadProgress.hidden = false;
    this.progressFill.classList.add('indeterminate');
    this.progressFill.style.width = '';
    this.progressText.textContent = `${this.i18n.t('uploading')} — ${file.name}`;

    try {
      const generatedName = await this.templateEngine.process(file, this.config.template);
      const client = new TelegramClient(this.config.token, this.config.chatId);

      const result = await client.upload(file, generatedName);

      /** @type {UploadRecord} */
      const record = {
        id: crypto.randomUUID(),
        name: generatedName,
        url: result.url,
        filePath: result.filePath,
        fileType: file.type || 'application/octet-stream',
        fileSize: file.size,
        uploadedAt: Date.now(),
        messageId: result.messageId,
      };

      this.history.add(record);
      this.toast.show(this.i18n.t('toast_upload_success'), 'success');
      this.#renderGallery();
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('401') || msg.includes('Unauthorized')) {
        this.toast.show(this.i18n.t('toast_config_invalid'), 'error');
      } else if (msg.includes('Network error') || msg.includes('Failed to fetch')) {
        this.toast.show(this.i18n.t('toast_network_error'), 'error');
      } else {
        this.toast.show(`${this.i18n.t('toast_upload_error')}: ${msg}`, 'error');
      }
    } finally {
      this.progressFill.classList.remove('indeterminate');
      this.uploadProgress.hidden = true;
    }
  }

  // ---- Preview ----

  /**
   * @param {UploadRecord} rec
   */
  #openPreview(rec) {
    const displayUrl = this.#getDisplayUrl(rec);
    this.currentPreviewUrl = displayUrl;
    this.previewName.textContent = rec.name;

    const isVideo = rec.fileType.startsWith('video/');
    if (isVideo) {
      this.previewBody.innerHTML = `<video src="${this.#escapeHtml(displayUrl)}" controls autoplay loop preload="metadata"></video>`;
    } else {
      this.previewBody.innerHTML = `<img src="${this.#escapeHtml(displayUrl)}" alt="${this.#escapeHtml(rec.name)}" loading="lazy">`;
    }

    this.previewDialog.showModal();
  }
}

// ============================================================
// Bootstrap
// ============================================================

const app = new App();
app.init();
