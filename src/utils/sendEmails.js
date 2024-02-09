import nodemalier from 'nodemailer'

export async function sendEmails({to , subject,html}) {
    const transporter = nodemalier.createTransport({
        host:"localhost",
        port:465,
        service:"gmail",
        secure:true,
        auth:{
            user:process.env.EMAIL,
            pass:process.env.AUTH_PASS
        }
    })

    const info = await transporter.sendMail({
        from:`"Test" <${process.env.EMAIL}>`,
        to,
        subject,
        html
    })
    
    if (info.accepted.length>0) return true
    return false
}