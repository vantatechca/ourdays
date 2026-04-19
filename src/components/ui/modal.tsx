"use client"

import * as React from "react"
import { X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Separator } from "@/components/ui/separator"

interface ModalProps {
  open: boolean
  onClose: () => void
  title?: React.ReactNode
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

const sizeMap: Record<NonNullable<ModalProps["size"]>, string> = {
  sm: "max-w-sm",
  md: "max-w-md",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  size = "md",
  className,
}: ModalProps) {
  React.useEffect(() => {
    if (!open) return
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose()
    }
    document.addEventListener("keydown", handleEscape)
    return () => document.removeEventListener("keydown", handleEscape)
  }, [open, onClose])

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className={cn(
          "w-full max-h-[85vh] overflow-y-auto rounded-xl border border-border bg-card p-6 shadow-lg",
          sizeMap[size],
          className
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {(title || description) && (
          <>
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                {title && <h2 className="text-lg font-semibold">{title}</h2>}
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
              <button
                onClick={onClose}
                className="p-1 rounded hover:bg-accent transition-colors shrink-0"
                aria-label="Close"
              >
                <X className="size-4" />
              </button>
            </div>
            <Separator className="mb-4" />
          </>
        )}
        {!title && !description && (
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 rounded hover:bg-accent transition-colors"
            aria-label="Close"
          >
            <X className="size-4" />
          </button>
        )}
        {children}
        {footer && (
          <>
            <Separator className="my-4" />
            <div className="flex items-center justify-end gap-2">{footer}</div>
          </>
        )}
      </div>
    </div>
  )
}
