'use client'

import { useState, useCallback, useRef, Fragment } from 'react'
import NextImage, { ImageProps } from 'next/image'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'

const basePath = process.env.BASE_PATH

const MIN_SCALE = 1
const MAX_SCALE = 4

function getDistance(t1: React.Touch, t2: React.Touch) {
  return Math.hypot(t2.clientX - t1.clientX, t2.clientY - t1.clientY)
}

export default function ZoomableImage({ src, alt, className, ...rest }: ImageProps) {
  const [isOpen, setIsOpen] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  // Zoom/pan state stored in refs for performance (avoid re-renders on every touch move)
  const scaleRef = useRef(1)
  const translateRef = useRef({ x: 0, y: 0 })
  const imgContainerRef = useRef<HTMLDivElement>(null)

  // Touch tracking
  const initialPinchDistance = useRef(0)
  const initialScale = useRef(1)
  const lastTapTime = useRef(0)
  const isDragging = useRef(false)
  const dragStart = useRef({ x: 0, y: 0 })
  const translateStart = useRef({ x: 0, y: 0 })

  const fullSrc = `${basePath || ''}${src}`

  const applyTransform = useCallback(() => {
    const el = imgContainerRef.current
    if (!el) return
    const s = scaleRef.current
    const { x, y } = translateRef.current
    el.style.transform = `scale(${s}) translate(${x}px, ${y}px)`
  }, [])

  const resetZoom = useCallback(() => {
    scaleRef.current = 1
    translateRef.current = { x: 0, y: 0 }
    applyTransform()
  }, [applyTransform])

  const open = useCallback(() => setIsOpen(true), [])

  const close = useCallback(() => {
    setIsOpen(false)
    resetZoom()
    // Blur the trigger button to prevent focus outline after mouse click
    setTimeout(() => buttonRef.current?.blur(), 0)
  }, [resetZoom])

  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        // Pinch start
        isDragging.current = false
        initialPinchDistance.current = getDistance(e.touches[0], e.touches[1])
        initialScale.current = scaleRef.current
      } else if (e.touches.length === 1) {
        // Check for double-tap
        const now = Date.now()
        if (now - lastTapTime.current < 300) {
          // Double-tap: toggle between 1x and 2.5x
          e.preventDefault()
          if (scaleRef.current > 1) {
            scaleRef.current = 1
            translateRef.current = { x: 0, y: 0 }
          } else {
            scaleRef.current = 2.5
            // Zoom toward tap point
            const rect = imgContainerRef.current?.getBoundingClientRect()
            if (rect) {
              const tapX = e.touches[0].clientX - rect.left - rect.width / 2
              const tapY = e.touches[0].clientY - rect.top - rect.height / 2
              translateRef.current = { x: -tapX * 0.6, y: -tapY * 0.6 }
            }
          }
          applyTransform()
          lastTapTime.current = 0
          return
        }
        lastTapTime.current = now

        // Single finger drag start (for panning when zoomed)
        if (scaleRef.current > 1) {
          isDragging.current = true
          dragStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
          translateStart.current = { ...translateRef.current }
        }
      }
    },
    [applyTransform]
  )

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length === 2) {
        // Pinch zoom
        e.preventDefault()
        const dist = getDistance(e.touches[0], e.touches[1])
        const ratio = dist / initialPinchDistance.current
        scaleRef.current = Math.min(MAX_SCALE, Math.max(MIN_SCALE, initialScale.current * ratio))
        if (scaleRef.current <= 1) {
          translateRef.current = { x: 0, y: 0 }
        }
        applyTransform()
      } else if (e.touches.length === 1 && isDragging.current && scaleRef.current > 1) {
        // Pan
        e.preventDefault()
        const dx = (e.touches[0].clientX - dragStart.current.x) / scaleRef.current
        const dy = (e.touches[0].clientY - dragStart.current.y) / scaleRef.current
        translateRef.current = {
          x: translateStart.current.x + dx,
          y: translateStart.current.y + dy,
        }
        applyTransform()
      }
    },
    [applyTransform]
  )

  const handleTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      isDragging.current = false
      // If pinch ended and scale went below 1, snap back
      if (scaleRef.current <= 1) {
        resetZoom()
      }
      // If all fingers lifted and scale is 1, check for single-tap close
      if (e.touches.length === 0 && scaleRef.current <= 1) {
        // Let the double-tap timer expire before deciding to close
        // The close-on-tap is handled via lastTapTime in touchStart
      }
    },
    [resetZoom]
  )

  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const delta = e.deltaY > 0 ? 0.9 : 1.1
      const newScale = Math.min(MAX_SCALE, Math.max(MIN_SCALE, scaleRef.current * delta))
      scaleRef.current = newScale
      if (newScale <= 1) {
        translateRef.current = { x: 0, y: 0 }
      }
      applyTransform()
    },
    [applyTransform]
  )

  // On backdrop click (not on image), close
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      // Only close if clicking the backdrop, not the image
      if (e.target === e.currentTarget) {
        close()
      }
    },
    [close]
  )

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={open}
        className={`group focus-visible:ring-primary-500 relative cursor-zoom-in border-0 bg-transparent p-0 outline-none focus-visible:rounded-sm focus-visible:ring-2 ${className || ''}`}
        aria-label={`Zoom image: ${alt || ''}`}
      >
        <NextImage src={fullSrc} alt={alt || ''} className={className} {...rest} />
        <span
          className="pointer-events-none absolute top-2 right-2 rounded-full bg-black/50 p-1.5 text-white opacity-0 backdrop-blur-sm transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100"
          aria-hidden="true"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7"
            />
          </svg>
        </span>
      </button>

      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" onClose={close} className="relative">
          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 z-90 bg-black/80 backdrop-blur-sm" />
          </TransitionChild>

          <TransitionChild
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
            <div className="fixed inset-0 z-100 overflow-hidden" onClick={handleBackdropClick}>
              <div className="flex min-h-full items-center justify-center p-4">
                <DialogPanel className="w-full max-w-5xl">
                  <div
                    ref={imgContainerRef}
                    className="origin-center transition-transform duration-100 ease-out"
                    style={{ touchAction: 'none' }}
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                    onWheel={handleWheel}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={typeof fullSrc === 'string' ? fullSrc : ''}
                      alt={alt?.toString() || ''}
                      className="h-auto max-w-full rounded-lg"
                      draggable={false}
                    />
                  </div>
                  {alt && (
                    <p className="mt-2 text-center text-sm text-gray-300">{alt.toString()}</p>
                  )}
                </DialogPanel>
              </div>
            </div>
          </TransitionChild>

          <button
            onClick={close}
            className="fixed top-4 right-4 z-100 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm transition-colors hover:bg-black/70"
            aria-label="Close zoom"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </Dialog>
      </Transition>
    </>
  )
}
