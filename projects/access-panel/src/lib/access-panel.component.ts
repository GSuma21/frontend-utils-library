import { Component, EventEmitter, Output, Renderer2, Inject, Input } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';

@Component({
  selector: 'lib-access-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './access-panel.component.html',
  styleUrls: ['./access-panel.component.css']
})
export class AccessPanelComponent {
  @Output() close = new EventEmitter<void>();
  @Input() isOpen = false;

  public settings = {
    fontSize: 16,
    lineHeight: 1.5,
    textSpacing: false,
    dyslexiaFriendly: false,
    hideImages: false,
    highlightLinks: false,
    cursor: false,
    darkMode: false,
    invertColors: false
  };

  private isReadingMode = false;
  private removeClickListener?: () => void;

  constructor(
    private renderer: Renderer2,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /** =============================
   * GLOBAL UTILITIES
   ============================== */

  /** Apply style globally (document + shadow roots) */
  private applyGlobalStyle(property: string, value: string | null) {
    const root = this.document.documentElement;
    if (value) {
      this.renderer.setStyle(root, property, value);
    } else {
      this.renderer.removeStyle(root, property);
    }

    // apply inside all shadow roots (for other libraries)
    this.document.querySelectorAll('*').forEach((el: any) => {
      if (el.shadowRoot) {
        el.shadowRoot.host?.style?.setProperty(property, value ?? '');
      }
    });
  }

  /** =============================
   * TEXT TO SPEECH
   ============================== */
  toggleTextToSpeech() {
    this.isReadingMode = !this.isReadingMode;

    if (this.isReadingMode) {
      console.log('🗣️ Reading mode ON — click any text to hear it');
      this.renderer.addClass(this.document.body, 'reading-mode');

      this.removeClickListener = this.renderer.listen('window', 'click', (event: MouseEvent) => {
        const target = event.target as HTMLElement;
        if (target.closest('.access-panel')) return;

        const text = (target.textContent || '').trim();
        if (!text) return;

        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = 'en-US';
        utterance.rate = 1;
        utterance.pitch = 1;
        window.speechSynthesis.speak(utterance);
      });
    } else {
      console.log('🔇 Reading mode OFF');
      this.renderer.removeClass(this.document.body, 'reading-mode');
      window.speechSynthesis.cancel();
      if (this.removeClickListener) this.removeClickListener();
    }
  }

  /** =============================
   * FONT SIZE / LINE HEIGHT
   ============================== */
  changeFontSize(increase: boolean) {
    this.settings.fontSize += increase ? 2 : -2;
    if (this.settings.fontSize < 10) this.settings.fontSize = 10;
    this.applyGlobalStyle('--access-font-size', `${this.settings.fontSize}px`);
    this.applyGlobalStyle('font-size', `${this.settings.fontSize}px`);
  }

  changeLineHeight() {
    this.settings.lineHeight += 0.2;
    if (this.settings.lineHeight > 2.5) this.settings.lineHeight = 1.5;
    this.applyGlobalStyle('--access-line-height', `${this.settings.lineHeight}`);
    this.applyGlobalStyle('line-height', `${this.settings.lineHeight}`);
  }

  /** =============================
   * HIGHLIGHT LINKS
   ============================== */
  toggleHighlightLinks() {
    this.settings.highlightLinks = !this.settings.highlightLinks;
    if (this.settings.highlightLinks) {
      this.renderer.addClass(this.document.body, 'highlight-links');
    } else {
      this.renderer.removeClass(this.document.body, 'highlight-links');
    }
  }

  /** =============================
   * TEXT SPACING
   ============================== */
  toggleTextSpacing() {
    this.settings.textSpacing = !this.settings.textSpacing;
    this.applyGlobalStyle('letter-spacing', this.settings.textSpacing ? '0.12em' : null);
    this.applyGlobalStyle('word-spacing', this.settings.textSpacing ? '0.16em' : null);
  }

  /** =============================
   * DYSLEXIA-FRIENDLY FONT
   ============================== */
  toggleDyslexiaFriendly() {
    this.settings.dyslexiaFriendly = !this.settings.dyslexiaFriendly;
    this.applyGlobalStyle(
      'font-family',
      this.settings.dyslexiaFriendly ? '"OpenDyslexic", Arial, sans-serif' : null
    );
  }

  /** =============================
   * HIDE IMAGES
   ============================== */
  toggleHideImages() {
    this.settings.hideImages = !this.settings.hideImages;
    const imgs = this.document.querySelectorAll('img');
    imgs.forEach(img =>
      this.renderer.setStyle(img, 'visibility', this.settings.hideImages ? 'hidden' : 'visible')
    );
  }

  /** =============================
   * CURSOR
   ============================== */
  toggleCursor() {
    this.settings.cursor = !this.settings.cursor;
    this.applyGlobalStyle(
      'cursor',
      this.settings.cursor
        ? 'url("https://img.icons8.com/ios-filled/50/000000/cursor.png") 2 2, auto'
        : null
    );
  }

  /** =============================
   * DARK MODE
   ============================== */
  toggleDarkMode() { this.settings.darkMode = !this.settings.darkMode; if (this.settings.darkMode) { this.renderer.addClass(this.document.body, 'dark-mode'); } else { this.renderer.removeClass(this.document.body, 'dark-mode'); } }

  /** =============================
   * INVERT COLORS
   ============================== */
  toggleInvertColors() {
    this.settings.invertColors = !this.settings.invertColors;
    this.applyGlobalStyle('filter', this.settings.invertColors ? 'invert(1)' : null);
  }

  /** =============================
   * RESET ALL
   ============================== */
  resetAll() {
    Object.keys(this.settings).forEach(key => (this.settings as any)[key] = false);
    this.settings.fontSize = 16;
    this.settings.lineHeight = 1.5;

    [
      'font-size',
      'line-height',
      'letter-spacing',
      'word-spacing',
      'font-family',
      'filter',
      'color',
      'background-color',
      'cursor'
    ].forEach(prop => this.applyGlobalStyle(prop, null));

    const imgs = this.document.querySelectorAll('img');
    imgs.forEach(img => this.renderer.setStyle(img, 'visibility', 'visible'));
  }

  /** CLOSE PANEL */
  closePanel() {
    this.close.emit();
  }
}
