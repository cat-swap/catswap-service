import * as React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from './Button';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
  showCloseButton?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const sizeClasses = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

/**
 * Accessible Modal component with focus trap and keyboard support
 */
const Modal = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  className,
  showCloseButton = true,
  size = 'md',
}: ModalProps) => {
  const modalRef = React.useRef<HTMLDivElement>(null);
  const previousActiveElement = React.useRef<Element | null>(null);
  const [isClosing, setIsClosing] = React.useState(false);

  // Handle ESC key and focus trap
  React.useEffect(() => {
    if (isOpen) {
      previousActiveElement.current = document.activeElement;
      // Focus the modal container after a short delay for animation
      setTimeout(() => {
        modalRef.current?.focus();
      }, 50);

      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          handleClose();
        }
        if (e.key === 'Tab') {
          handleTabKey(e);
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.body.style.overflow = '';
      };
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      onClose();
      // Restore focus
      if (previousActiveElement.current instanceof HTMLElement) {
        previousActiveElement.current.focus();
      }
    }, 200);
  };

  const handleTabKey = (e: KeyboardEvent) => {
    if (!modalRef.current) return;

    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    if (e.shiftKey) {
      if (document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      }
    } else {
      if (document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  };

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleOverlayClick}
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity duration-200',
          isClosing ? 'opacity-0' : 'opacity-100'
        )}
        aria-hidden="true"
      />

      {/* Modal */}
      <div
        ref={modalRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'modal-title' : undefined}
        aria-describedby={description ? 'modal-description' : undefined}
        tabIndex={-1}
        className={cn(
          'relative z-10 w-full bg-[var(--bg-secondary)] rounded-2xl border border-[var(--border-primary)] shadow-2xl',
          'transform transition-all duration-200',
          isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100',
          sizeClasses[size],
          className
        )}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-primary)]">
            {title && (
              <div className="space-y-1">
                <h2
                  id="modal-title"
                  className="text-lg font-semibold text-[var(--text-primary)]"
                >
                  {title}
                </h2>
                {description && (
                  <p
                    id="modal-description"
                    className="text-sm text-[var(--text-secondary)]"
                  >
                    {description}
                  </p>
                )}
              </div>
            )}
            {showCloseButton && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClose}
                className="rounded-full"
                aria-label="Close modal"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}

        {/* Content */}
        <div className="px-6 py-4">{children}</div>
      </div>
    </div>
  );
};

export { Modal };
