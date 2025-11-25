/**
 * Crops an image to the specified aspect ratio
 * @param {string} imageDataUrl - Base64 image data URL
 * @param {string} aspectRatio - One of: 'vertical', 'horizontal', 'small-square', 'large-square'
 * @param {number} maxSize - Maximum size constraint (width or height depending on ratio)
 * @returns {Promise<string>} - Cropped image as base64 data URL
 */
export const cropImage = (imageDataUrl, aspectRatio, maxSize = 600) => {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = () => {
      const canvas = document.createElement('canvas')
      const ctx = canvas.getContext('2d')

      let targetWidth, targetHeight, sourceX, sourceY, sourceWidth, sourceHeight

      // Determine target dimensions based on aspect ratio
      switch (aspectRatio) {
        case 'vertical': // 9:16
          if (img.width / img.height > 9 / 16) {
            // Image is wider than target ratio, crop width
            sourceHeight = img.height
            sourceWidth = img.height * (9 / 16)
            sourceX = (img.width - sourceWidth) / 2
            sourceY = 0
          } else {
            // Image is taller than target ratio, crop height
            sourceWidth = img.width
            sourceHeight = img.width * (16 / 9)
            sourceX = 0
            sourceY = (img.height - sourceHeight) / 2
          }
          targetHeight = maxSize
          targetWidth = maxSize * (9 / 16)
          break

        case 'horizontal': // 16:9
          if (img.width / img.height > 16 / 9) {
            // Image is wider than target ratio, crop width
            sourceHeight = img.height
            sourceWidth = img.height * (16 / 9)
            sourceX = (img.width - sourceWidth) / 2
            sourceY = 0
          } else {
            // Image is taller than target ratio, crop height
            sourceWidth = img.width
            sourceHeight = img.width * (9 / 16)
            sourceX = 0
            sourceY = (img.height - sourceHeight) / 2
          }
          targetWidth = maxSize
          targetHeight = maxSize * (9 / 16)
          break

        case 'small-square': // 1:1, 300px
          targetWidth = 300
          targetHeight = 300
          if (img.width > img.height) {
            sourceHeight = img.height
            sourceWidth = img.height
            sourceX = (img.width - sourceWidth) / 2
            sourceY = 0
          } else {
            sourceWidth = img.width
            sourceHeight = img.width
            sourceX = 0
            sourceY = (img.height - sourceHeight) / 2
          }
          break

        case 'large-square': // 1:1, 600px
        default:
          targetWidth = maxSize
          targetHeight = maxSize
          if (img.width > img.height) {
            sourceHeight = img.height
            sourceWidth = img.height
            sourceX = (img.width - sourceWidth) / 2
            sourceY = 0
          } else {
            sourceWidth = img.width
            sourceHeight = img.width
            sourceX = 0
            sourceY = (img.height - sourceHeight) / 2
          }
          break
      }

      // Set canvas dimensions to target size
      canvas.width = targetWidth
      canvas.height = targetHeight

      // Draw cropped and scaled image
      ctx.drawImage(
        img,
        sourceX, sourceY, sourceWidth, sourceHeight,
        0, 0, targetWidth, targetHeight
      )

      // Convert canvas to data URL
      const croppedDataUrl = canvas.toDataURL('image/jpeg', 0.9)
      resolve(croppedDataUrl)
    }

    img.onerror = () => {
      reject(new Error('Failed to load image'))
    }

    img.src = imageDataUrl
  })
}
