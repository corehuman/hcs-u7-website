export interface KeyboardDynamics {
  interKeyLatency: number[];
  holdDuration: number[];
  errorCorrections: number;
  typingRhythm: number;
}

export interface MouseBallistics {
  curveDeviation: number[];
  acceleration: number[];
  pauseDuration: number[];
  fittsLawCompliance: number;
}

export interface HardwareFingerprintResult {
  isLikelyBot: boolean;
  confidence: number;
  metrics: {
    keyboardVariance: number;
    mouseSmoothness: number;
    errorRate: number;
  };
}

function safeNow(): number {
  return typeof performance !== "undefined" ? performance.now() : Date.now();
}

export class HardwareFingerprinter {
  private keyboardData: KeyboardDynamics;
  private mouseData: MouseBallistics;

  private lastKeyTime = 0;
  private keyDownTime = 0;

  private lastMouseX = 0;
  private lastMouseY = 0;
  private lastMouseTime = 0;
  private lastVelocity = 0;
  private rafId: number | null = null;

  private keydownHandler?: (e: KeyboardEvent) => void;
  private keyupHandler?: (e: KeyboardEvent) => void;
  private mouseMoveHandler?: (e: MouseEvent) => void;

  private disposed = false;

  constructor() {
    this.keyboardData = {
      interKeyLatency: [],
      holdDuration: [],
      errorCorrections: 0,
      typingRhythm: 0,
    };

    this.mouseData = {
      curveDeviation: [],
      acceleration: [],
      pauseDuration: [],
      fittsLawCompliance: 0,
    };

    if (typeof document === "undefined" || typeof window === "undefined") {
      return;
    }

    this.initKeyboardTracking();
    this.initMouseTracking();
  }

  /**
   * Keyboard dynamics in capture phase to avoid interfering with existing handlers.
   */
  private initKeyboardTracking(): void {
    this.keydownHandler = (e: KeyboardEvent) => {
      const now = safeNow();

      if (this.lastKeyTime > 0) {
        this.keyboardData.interKeyLatency.push(now - this.lastKeyTime);
      }

      this.keyDownTime = now;
      this.lastKeyTime = now;

      if (e.key === "Backspace") {
        this.keyboardData.errorCorrections += 1;
      }
    };

    this.keyupHandler = () => {
      const now = safeNow();
      if (this.keyDownTime > 0) {
        this.keyboardData.holdDuration.push(now - this.keyDownTime);
      }
    };

    document.addEventListener("keydown", this.keydownHandler, { capture: true });
    document.addEventListener("keyup", this.keyupHandler, { capture: true });
  }

  /**
   * Mouse ballistics: sample at most once per frame, passive for perf.
   */
  private initMouseTracking(): void {
    this.mouseMoveHandler = (e: MouseEvent) => {
      if (this.rafId != null) return;

      this.rafId = window.requestAnimationFrame(() => {
        const now = safeNow();

        if (this.lastMouseTime === 0) {
          this.lastMouseX = e.clientX;
          this.lastMouseY = e.clientY;
          this.lastMouseTime = now;
          this.lastVelocity = 0;
          this.rafId = null;
          return;
        }

        const dx = e.clientX - this.lastMouseX;
        const dy = e.clientY - this.lastMouseY;
        const dt = now - this.lastMouseTime;

        if (dt > 0) {
          const distance = Math.sqrt(dx * dx + dy * dy);
          const velocity = distance / dt;
          const accel = Math.abs(velocity - this.lastVelocity) / dt;

          this.mouseData.acceleration.push(accel);

          // Simple pause detection
          if (distance < 1 && dt > 80) {
            this.mouseData.pauseDuration.push(dt);
          }

          this.lastVelocity = velocity;
        }

        this.lastMouseX = e.clientX;
        this.lastMouseY = e.clientY;
        this.lastMouseTime = now;
        this.rafId = null;
      });
    };

    document.addEventListener("mousemove", this.mouseMoveHandler, {
      passive: true,
    });
  }

  /**
   * Analyse patterns pour détecter un comportement potentiellement bot.
   */
  public analyzePatterns(): HardwareFingerprintResult {
    const keyVariance = this.calculateVariance(this.keyboardData.interKeyLatency);
    const mouseSmoothness = this.calculateSmoothness(this.mouseData.acceleration);

    const keyEvents = this.keyboardData.interKeyLatency.length || 1;
    const errorRate = this.keyboardData.errorCorrections / keyEvents;

    const confidence = this.calculateConfidence(keyVariance, mouseSmoothness, errorRate);

    const isLikelyBot = keyVariance < 10 || mouseSmoothness > 0.95;

    return {
      isLikelyBot,
      confidence,
      metrics: {
        keyboardVariance: keyVariance,
        mouseSmoothness,
        errorRate,
      },
    };
  }

  public dispose(): void {
    if (this.disposed) return;
    this.disposed = true;

    if (typeof document !== "undefined") {
      if (this.keydownHandler) {
        document.removeEventListener("keydown", this.keydownHandler, { capture: true } as any);
      }
      if (this.keyupHandler) {
        document.removeEventListener("keyup", this.keyupHandler, { capture: true } as any);
      }
      if (this.mouseMoveHandler) {
        document.removeEventListener("mousemove", this.mouseMoveHandler as any, {
          passive: true,
        } as any);
      }
    }

    if (this.rafId != null && typeof window !== "undefined") {
      window.cancelAnimationFrame(this.rafId);
    }
  }

  private calculateVariance(data: number[]): number {
    if (!data.length) return 0;
    const mean = data.reduce((a, b) => a + b, 0) / data.length;
    const squareDiffs = data.map((x) => (x - mean) * (x - mean));
    const variance = squareDiffs.reduce((a, b) => a + b, 0) / data.length;
    return Math.sqrt(variance);
  }

  private calculateSmoothness(accelerations: number[]): number {
    if (!accelerations.length) return 0.5;

    const mean = accelerations.reduce((a, b) => a + b, 0) / accelerations.length;
    const absDev =
      accelerations.reduce((sum, a) => sum + Math.abs(a - mean), 0) /
      accelerations.length;

    // map dispersion -> [0,1], bots tendent vers 1 (très régulier)
    const scaled = Math.max(0, Math.min(1, 1 - Math.tanh(absDev)));
    return scaled;
  }

  private calculateConfidence(
    keyVariance: number,
    mouseSmoothness: number,
    errorRate: number,
  ): number {
    let score = 0;

    // Plus de variance clavier = plus humain
    if (keyVariance > 50) score += 0.4;

    // Mouse non-linéaire = plus humain
    if (mouseSmoothness < 0.8) score += 0.4;

    // Quelques corrections d'erreurs = comportement humain
    if (errorRate > 0 && errorRate < 0.3) score += 0.2;

    return Math.max(0, Math.min(1, score));
  }
}
