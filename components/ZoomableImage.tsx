'use client'

import { useState, useCallback, useEffect, useRef, Fragment } from 'react'
import NextImage, { ImageProps } from 'next/image'
import { Dialog, DialogPanel, Transition, TransitionChild } from '@headlessui/react'
import { disableBodyScroll, enableBodyScroll } from 'body-scroll-lock'

const basePath = process.env.BASE_PATH

export default function ZoomableImage({ src, alt, className, ...rest }: ImageProps) {
  const [isOpen, setIsOpen] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  const fullSrc = `${basePath || ''}${src}`

  const open = useCallback(() => setIsOpen(true), [])
  const close = useCallback(() => setIsOpen(false), [])

  useEffect(() => {
    const el = overlayRef.current
    if (isOpen && el) {
      disableBodyScroll(el)
      return () => enableBodyScroll(el)
    }
  }, [isOpen])

  return (
    <>
      <button
        type="button"
        onClick={open}
        className={`group relative cursor-zoom-in border-0 bg-transparent p-0 ${className || ''}`}
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
            <div className="fixed inset-0 z-100 overflow-y-auto">
              <div className="flex min-h-full items-center justify-center p-4">
                <DialogPanel
                  ref={overlayRef}
                  className="w-full max-w-5xl cursor-zoom-out"
                  onClick={close}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={typeof fullSrc === 'string' ? fullSrc : ''}
                    alt={alt?.toString() || ''}
                    className="h-auto w-full rounded-lg"
                  />
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
