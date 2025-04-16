/**
 * Categorizes QR code content based on simple rules.
 * @param data The QR code data.
 * @returns A category string.
 */
export async function categorizeQrCodeContent(data: string): Promise<string> {
  if (data.startsWith('http://') || data.startsWith('https://')) {
    return 'URL';
  } else if (data.includes('@') && data.includes('.')) {
    return 'Email';
  } else {
    return 'Text';
  }
}
