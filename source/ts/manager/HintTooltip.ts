export class HintTooltip {
  private readonly tooltipElement: HTMLDivElement;
  private readonly DISPLAY_DURATION = 3000; // 3 seconds
  private readonly IDLE_THRESHOLD = 120000; // 2 minutes

  private idleTimer: ReturnType<typeof setTimeout> | null = null;
  private hideTimer: ReturnType<typeof setTimeout> | null = null;
  private isVisible = false;
  private isFirstLoad = false;
  private lastActivityTime = Date.now();

  constructor() {
    this.tooltipElement = this.createTooltipElement();
    document.body.appendChild(this.tooltipElement);
    this.bindEvents();
  }

  private bindEvents(): void {
    addEventListener("spineAssetsLoaded", () => {
      if (!this.isFirstLoad) {
        this.isFirstLoad = true;
        this.show();
        this.setupIdleDetection();
      }
    });
  }

  private createTooltipElement(): HTMLDivElement {
    const tooltip = document.createElement('div');
    tooltip.classList.add('hint-tooltip');
    tooltip.id = 'hint-tooltip';

    const textSpan = document.createElement('span');
    textSpan.classList.add('hint-tooltip-text');
    textSpan.innerHTML = `Tip: Drag to reposition <span class="hint-tooltip-separator">•</span> Ctrl + Scroll to zoom`;

    tooltip.appendChild(textSpan);
    return tooltip;
  }

  private setupIdleDetection(): void {
    const activityEvents = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'wheel'];

    const resetIdleTimer = (): void => {
      this.lastActivityTime = Date.now();

      if (this.idleTimer) {
        clearTimeout(this.idleTimer);
      }

      this.idleTimer = setTimeout(() => {
        this.onIdle();
      }, this.IDLE_THRESHOLD);
    };

    activityEvents.forEach(event => {
      document.addEventListener(event, resetIdleTimer, { passive: true });
    });

    // Start the idle timer
    resetIdleTimer();
  }

  private onIdle(): void {
    if (!this.isVisible) {
      this.show();
    }
  }

  show(): void {
    if (this.isVisible) return;

    this.isVisible = true;
    this.tooltipElement.classList.remove('fade-out');
    this.tooltipElement.classList.add('slide-in');

    // Clear any existing hide timer
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }

    // Schedule hide after display duration
    this.hideTimer = setTimeout(() => {
      this.hide();
    }, this.DISPLAY_DURATION);
  }

  hide(): void {
    if (!this.isVisible) return;

    this.tooltipElement.classList.add('fade-out');

    // Wait for animation to complete before marking as hidden
    setTimeout(() => {
      this.tooltipElement.classList.remove('slide-in');
      this.isVisible = false;
    }, 1000); // Match the fade-out animation duration (1s)
  }

  destroy(): void {
    if (this.idleTimer) {
      clearTimeout(this.idleTimer);
    }
    if (this.hideTimer) {
      clearTimeout(this.hideTimer);
    }
    this.tooltipElement.remove();
  }
}
