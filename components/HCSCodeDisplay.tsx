'use client';

import { useState, useEffect, useCallback } from 'react';
import type { RotatingHCSCode } from '@/lib/hcs-rotating-code';
import { getTimeUntilExpiration } from '@/lib/hcs-rotating-code';

/**
 * HCS CODE DISPLAY avec COUNTDOWN
 * 
 * Affiche code HCS rotatif avec:
 * - Countdown visuel jusqu'à expiration
 * - Auto-refresh automatique
 * - Copie dans clipboard
 * - Indicateur sécurité
 */

interface HCSCodeDisplayProps {
  rotatingCode: RotatingHCSCode;
  onRefresh?: () => Promise<RotatingHCSCode>; // Callback pour refresh
}

export default function HCSCodeDisplay({ 
  rotatingCode: initialCode,
  onRefresh,
}: HCSCodeDisplayProps) {
  // État
  const [currentCode, setCurrentCode] = useState(initialCode);
  const [timeLeft, setTimeLeft] = useState(
    getTimeUntilExpiration(initialCode.currentWindow)
  );
  const [copied, setCopied] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshCode = useCallback(async () => {
    if (!onRefresh || isRefreshing) return;

    setIsRefreshing(true);

    try {
      const newCode = await onRefresh();
      setCurrentCode(newCode);
      setTimeLeft(getTimeUntilExpiration(newCode.currentWindow));
    } catch (error) {
      console.error('[HCSCodeDisplay] Erreur refresh:', error);
    } finally {
      setIsRefreshing(false);
    }
  }, [onRefresh, isRefreshing]);

  // Update countdown chaque seconde
  useEffect(() => {
    const interval = setInterval(() => {
      const newTimeLeft = getTimeUntilExpiration(currentCode.currentWindow);
      setTimeLeft(newTimeLeft);

      // Auto-refresh si expiré
      if (newTimeLeft <= 0 && onRefresh) {
        void refreshCode();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [currentCode, onRefresh, refreshCode]);

  /**
   * Copier code dans clipboard
   */
  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(currentCode.currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('[HCSCodeDisplay] Erreur copie:', error);
    }
  };

  // Calcul temps restant (min:sec)
  const minutes = Math.floor(timeLeft / 60000);
  const seconds = Math.floor((timeLeft % 60000) / 1000);
  const progress =
    currentCode.rotationPeriod > 0
      ? (timeLeft / currentCode.rotationPeriod) * 100
      : 0;

  // Classes conditionnelles
  const urgencyClass =
    timeLeft < 60000 ? 'urgent' : timeLeft < 180000 ? 'warning' : 'normal';

  return (
    <div className="hcs-code-display-container">
      <div className="hcs-code-card">
        {/* Header */}
        <div className="card-header">
          <h3 className="card-title">🎯 Votre Code HCS-U7</h3>
          <div className="security-badge">🔒 Sécurisé par rotation</div>
        </div>

        {/* Code principal */}
        <div className="code-section">
          <div className="code-box">
            <code className="code-text">{currentCode.currentCode}</code>
          </div>

          <div className="code-actions">
            <button
              type="button"
              onClick={copyToClipboard}
              className="btn-copy"
              disabled={copied}
            >
              {copied ? '✅ Copié!' : '📋 Copier le code'}
            </button>

            {onRefresh && (
              <button
                type="button"
                onClick={refreshCode}
                className="btn-refresh"
                disabled={isRefreshing}
              >
                {isRefreshing ? '⏳ Rafraîchissement...' : '🔄 Rafraîchir'}
              </button>
            )}
          </div>
        </div>

        {/* Countdown */}
        <div className={`countdown-section ${urgencyClass}`}>
          <div className="countdown-header">
            <span className="countdown-label">⏰ Expire dans:</span>
          </div>

          <div className="countdown-display">
            {/* Progress ring */}
            <div className="progress-ring">
              <svg className="progress-svg" width="120" height="120">
                <circle
                  className="progress-bg"
                  cx="60"
                  cy="60"
                  r="50"
                  strokeWidth="8"
                  fill="none"
                />
                <circle
                  className="progress-fill"
                  cx="60"
                  cy="60"
                  r="50"
                  strokeWidth="8"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 50}`}
                  strokeDashoffset={
                    `${2 * Math.PI * 50 * (1 - Math.max(0, Math.min(100, progress)) / 100)}`
                  }
                  transform="rotate(-90 60 60)"
                />
              </svg>

              <div className="time-display">
                <span className="time-value">
                  {minutes}:{seconds.toString().padStart(2, '0')}
                </span>
              </div>
            </div>

            <div className="countdown-info">
              <p className="countdown-message">
                {timeLeft < 60000 ? (
                  <>⚠️ Code expire bientôt!</>
                ) : timeLeft < 180000 ? (
                  <>⏳ Code expire dans {minutes} minute{minutes > 1 ? 's' : ''}</>
                ) : (
                  <>✅ Code valide pour {minutes} minutes</>
                )}
              </p>

              <p className="auto-refresh-notice">
                <small>
                  {onRefresh
                    ? '🔄 Renouvellement automatique activé'
                    : 'Rafraîchissez manuellement après expiration'}
                </small>
              </p>
            </div>
          </div>
        </div>

        {/* Informations sécurité */}
        <details className="security-details">
          <summary className="security-summary">🔐 Comment ça fonctionne?</summary>

          <div className="security-content">
            <h4>Rotation automatique toutes les 10 minutes</h4>

            <div className="security-features">
              <div className="feature">
                <span className="feature-icon">🚫</span>
                <div className="feature-text">
                  <strong>Anti-Replay</strong>
                  <p>Les codes périmés ne peuvent pas être réutilisés</p>
                </div>
              </div>

              <div className="feature">
                <span className="feature-icon">🏭</span>
                <div className="feature-text">
                  <strong>Anti-Farm</strong>
                  <p>Impossible à revendre (expire après 10 minutes)</p>
                </div>
              </div>

              <div className="feature">
                <span className="feature-icon">🔒</span>
                <div className="feature-text">
                  <strong>Cryptographie</strong>
                  <p>Transformation HMAC-SHA256 sécurisée</p>
                </div>
              </div>
            </div>

            <div className="tech-details">
              <p>
                <small>
                  <strong>Technique:</strong> Basé sur TOTP (RFC 6238), même principe que
                  Google Authenticator. Votre profil cognitif de base reste immuable, seul
                  le code affiché change.
                </small>
              </p>
            </div>
          </div>
        </details>
      </div>

      {/* Styles (à externaliser en CSS module si préféré) */}
      <style>{`
        .hcs-code-display-container {
          display: flex;
          justify-content: center;
          padding: 2rem;
        }

        .hcs-code-card {
          max-width: 600px;
          width: 100%;
          background: white;
          border-radius: 1rem;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .card-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 1.5rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .card-title {
          font-size: 1.5rem;
          font-weight: 700;
          margin: 0;
        }

        .security-badge {
          background: rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 9999px;
          font-size: 0.875rem;
        }

        .code-section {
          padding: 2rem;
          background: #f9fafb;
        }

        .code-box {
          background: #1f2937;
          padding: 1.5rem;
          border-radius: 0.5rem;
          margin-bottom: 1rem;
          overflow-x: auto;
        }

        .code-text {
          color: #10b981;
          font-family: 'Courier New', monospace;
          font-size: 0.875rem;
          word-break: break-all;
        }

        .code-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-copy,
        .btn-refresh {
          flex: 1;
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 0.5rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-copy {
          background: linear-gradient(135deg, #667eea, #764ba2);
          color: white;
        }

        .btn-copy:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
        }

        .btn-copy:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .btn-refresh {
          background: #6b7280;
          color: white;
        }

        .btn-refresh:hover:not(:disabled) {
          background: #4b5563;
        }

        .countdown-section {
          padding: 2rem;
          border-top: 2px solid #e5e7eb;
        }

        .countdown-section.urgent {
          background: #fef2f2;
          border-color: #fca5a5;
        }

        .countdown-section.warning {
          background: #fffbeb;
          border-color: #fcd34d;
        }

        .countdown-header {
          text-align: center;
          margin-bottom: 1rem;
        }

        .countdown-label {
          font-size: 1.125rem;
          font-weight: 600;
          color: #374151;
        }

        .countdown-display {
          display: flex;
          align-items: center;
          gap: 2rem;
          justify-content: center;
          flex-wrap: wrap;
        }

        .progress-ring {
          position: relative;
          width: 120px;
          height: 120px;
        }

        .progress-svg {
          transform: rotate(-90deg);
        }

        .progress-bg {
          stroke: #e5e7eb;
        }

        .progress-fill {
          stroke: #667eea;
          transition: stroke-dashoffset 1s linear;
        }

        .urgent .progress-fill {
          stroke: #ef4444;
        }

        .warning .progress-fill {
          stroke: #f59e0b;
        }

        .time-display {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
        }

        .time-value {
          font-size: 1.75rem;
          font-weight: 700;
          color: #1f2937;
        }

        .countdown-info {
          text-align: center;
        }

        .countdown-message {
          font-size: 1.125rem;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: #374151;
        }

        .auto-refresh-notice {
          color: #6b7280;
          margin: 0;
        }

        .security-details {
          border-top: 2px solid #e5e7eb;
          padding: 1.5rem 2rem;
        }

        .security-summary {
          cursor: pointer;
          font-weight: 600;
          color: #4b5563;
          user-select: none;
          list-style: none;
        }

        .security-summary::-webkit-details-marker {
          display: none;
        }

        .security-content {
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid #e5e7eb;
        }

        .security-content h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #374151;
        }

        .security-features {
          display: grid;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .feature {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .feature-icon {
          font-size: 1.5rem;
        }

        .feature-text strong {
          display: block;
          font-weight: 600;
          color: #374151;
          margin-bottom: 0.25rem;
        }

        .feature-text p {
          margin: 0;
          color: #6b7280;
          font-size: 0.875rem;
        }

        .tech-details {
          background: #f9fafb;
          padding: 1rem;
          border-radius: 0.5rem;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
}
