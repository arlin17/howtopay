'use client'

import { useEffect, useState } from 'react'
import QRCode from 'qrcode'

interface Props {
  url: string
  size?: number
}

export function QRCodeDisplay({ url, size = 200 }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: size,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    }).then(setDataUrl)
  }, [url, size])

  const handleDownload = async () => {
    const largeDataUrl = await QRCode.toDataURL(url, {
      width: 1024,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    })

    const link = document.createElement('a')
    link.download = 'cheddar-qr.png'
    link.href = largeDataUrl
    link.click()
  }

  if (!dataUrl) {
    return (
      <div
        className="animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <>
      <div className="space-y-4">
        <div
          className="cursor-pointer overflow-hidden rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-700"
          onClick={() => setShowModal(true)}
        >
          <img src={dataUrl} alt="QR Code" width={size} height={size} />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="flex-1 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          >
            Download PNG
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex-1 rounded-lg bg-zinc-100 px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-white dark:hover:bg-zinc-700"
          >
            View larger
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="max-w-lg rounded-2xl bg-white p-6 dark:bg-zinc-900"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-zinc-900 dark:text-white">
                Your QR Code
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300"
              >
                <svg
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className="mt-4 flex justify-center">
              <QRCodeLarge url={url} />
            </div>
            <p className="mt-4 text-center text-sm text-zinc-500">
              Scan to open your pay page
            </p>
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleDownload}
                className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-500"
              >
                Download high-res PNG
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

function QRCodeLarge({ url }: { url: string }) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)

  useEffect(() => {
    QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#ffffff',
      },
    }).then(setDataUrl)
  }, [url])

  if (!dataUrl) {
    return (
      <div className="h-[300px] w-[300px] animate-pulse rounded-lg bg-zinc-200 dark:bg-zinc-700" />
    )
  }

  return (
    <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white p-2 dark:border-zinc-700">
      <img src={dataUrl} alt="QR Code" width={300} height={300} />
    </div>
  )
}
