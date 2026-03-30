import type { EncodedFile } from '../types'

export function useFileReader() {
  function readFileAsBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => {
        const result = reader.result as string
        resolve(result.split(',')[1])
      }
      reader.onerror = () => reject(reader.error)
      reader.readAsDataURL(file)
    })
  }

  async function encodeFiles(files: File[], targetPath: string): Promise<EncodedFile[]> {
    const normalized = targetPath.replace(/\/+$/, '')
    return Promise.all(
      files.map(async (file) => {
        const base64 = await readFileAsBase64(file)
        const path = normalized ? `${normalized}/${file.name}` : file.name
        return { name: file.name, path, base64, size: file.size }
      }),
    )
  }

  return { encodeFiles }
}
