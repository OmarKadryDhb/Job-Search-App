import QRcode from 'qrcode'

export async function generateQrCode(data) {
    return await QRcode.toDataURL(JSON.stringify(data))
}