import { useCallback, useEffect } from 'react'
import useScrollLock from '@/hooks/useScrollLock'

/**
 * Reusable confirmation modal.
 *
 * Props:
 *  - isOpen: boolean
 *  - title, description: node
 *  - confirmLabel, cancelLabel: strings
 *  - onConfirm, onCancel: () => void
 *  - confirmDisabled: boolean
 *  - loading: boolean
 *  - tone: 'danger' | 'default'
 *  - children: additional body content (e.g. inputs)
 */
const ConfirmationModal = ({
  isOpen,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  confirmDisabled = false,
  loading = false,
  tone = 'default',
  children,
}) => {
  const handleKey = useCallback((e) => {
    if (e.key === 'Escape' && onCancel) onCancel()
  }, [onCancel])

  // Lock background scroll while open (scrollbar-width compensated, no flicker).
  useScrollLock(isOpen)

  useEffect(() => {
    if (!isOpen) return
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('keydown', handleKey)
    }
  }, [isOpen, handleKey])

  if (!isOpen) return null

  return (
    <div className="confirm-modal" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : 'Confirmation'}>
      <div className="confirm-modal__backdrop" onClick={onCancel} />
      <div className="confirm-modal__panel">
        {title && <h2 className="confirm-modal__title">{title}</h2>}
        {description && <div className="confirm-modal__desc">{description}</div>}
        {children && <div className="confirm-modal__body">{children}</div>}
        <div className="confirm-modal__actions">
          <button
            type="button"
            className="confirm-modal__btn confirm-modal__btn--ghost"
            onClick={onCancel}
            disabled={loading}
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            className={`confirm-modal__btn ${tone === 'danger' ? 'confirm-modal__btn--danger' : 'confirm-modal__btn--primary'}`}
            onClick={onConfirm}
            disabled={confirmDisabled || loading}
          >
            {loading ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default ConfirmationModal
