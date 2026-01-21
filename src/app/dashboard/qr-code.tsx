'use client'

import { useEffect, useState, useCallback } from 'react'
import QRCode from 'qrcode'

interface Props {
  url: string
  size?: number
}

// Helper to generate QR code with centered logo
async function generateQRWithLogo(url: string, size: number): Promise<string> {
  // Create canvas
  const canvas = document.createElement('canvas')
  canvas.width = size
  canvas.height = size
  const ctx = canvas.getContext('2d')!

  // Generate QR code to canvas
  await QRCode.toCanvas(canvas, url, {
    width: size,
    margin: 2,
    color: {
      dark: '#000000',
      light: '#ffffff',
    },
    errorCorrectionLevel: 'H', // High error correction to allow for logo
  })

  // Draw logo in center
  const logoSize = size * 0.22
  const logoX = (size - logoSize) / 2
  const logoY = (size - logoSize) / 2

  // White background for logo
  ctx.fillStyle = '#ffffff'
  ctx.beginPath()
  ctx.roundRect(logoX - 4, logoY - 4, logoSize + 8, logoSize + 8, 6)
  ctx.fill()

  // Yellow/amber gradient background
  const gradient = ctx.createLinearGradient(logoX, logoY, logoX + logoSize, logoY + logoSize)
  gradient.addColorStop(0, '#facc15') // yellow-400
  gradient.addColorStop(1, '#f59e0b') // amber-500
  ctx.fillStyle = gradient
  ctx.beginPath()
  ctx.roundRect(logoX, logoY, logoSize, logoSize, 4)
  ctx.fill()

  // Draw "C" letter
  ctx.fillStyle = '#ffffff'
  ctx.font = `bold ${logoSize * 0.65}px system-ui, -apple-system, sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillText('C', size / 2, size / 2 + 1)

  return canvas.toDataURL('image/png')
}

export function QRCodeDisplay({ url, size = 200 }: Props) {
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [showModal, setShowModal] = useState(false)

  useEffect(() => {
    generateQRWithLogo(url, size).then(setDataUrl)
  }, [url, size])

  const handleDownload = useCallback(async () => {
    const largeDataUrl = await generateQRWithLogo(url, 1024)
    const link = document.createElement('a')
    link.download = 'cheddar-qr.png'
    link.href = largeDataUrl
    link.click()
  }, [url])

  if (!dataUrl) {
    return (
      <div
        className="animate-pulse rounded-lg bg-background-muted"
        style={{ width: size, height: size }}
      />
    )
  }

  return (
    <>
      <div className="flex flex-col items-center space-y-3">
        <div
          className="cursor-pointer overflow-hidden rounded-xl border-2 border-border bg-white p-3 transition-all hover:border-primary hover:shadow-glow"
          onClick={() => setShowModal(true)}
        >
          <img src={dataUrl} alt="QR Code" width={size} height={size} className="rounded" />
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleDownload}
            className="rounded-lg bg-background-muted px-3 py-2 text-xs font-medium text-foreground hover:bg-border"
          >
            Download
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="rounded-lg bg-background-muted px-3 py-2 text-xs font-medium text-foreground hover:bg-border"
          >
            Enlarge
          </button>
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setShowModal(false)}
        >
          <div
            className="max-w-lg rounded-2xl bg-background-subtle p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-foreground">
                Your QR Code
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-foreground-muted hover:text-foreground"
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
            <p className="mt-4 text-center text-sm text-foreground-muted">
              Scan to open your pay page
            </p>
            <div className="mt-4 flex justify-center">
              <button
                onClick={handleDownload}
                className="rounded-lg bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-hover"
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
    generateQRWithLogo(url, 300).then(setDataUrl)
  }, [url])

  if (!dataUrl) {
    return (
      <div className="h-[300px] w-[300px] animate-pulse rounded-lg bg-background-muted" />
    )
  }

  return (
    <div className="overflow-hidden rounded-xl border-2 border-border bg-white p-3">
      <img src={dataUrl} alt="QR Code" width={300} height={300} className="rounded" />
    </div>
  )
}
