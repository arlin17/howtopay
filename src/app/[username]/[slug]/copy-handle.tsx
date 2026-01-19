'use client'

export function CopyHandle({ handle }: { handle: string }) {
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(handle)
    } catch {
      // Fallback
      const textarea = document.createElement('textarea')
      textarea.value = handle
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      document.body.removeChild(textarea)
    }
  }

  return (
    <button
      onClick={handleCopy}
      className="text-xs text-blue-600 hover:text-blue-500"
    >
      Copy
    </button>
  )
}
