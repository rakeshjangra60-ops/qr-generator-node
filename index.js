const express = require('express');
const QRCode = require('qrcode');

const app = express();

app.get('/qr', async (req, res) => {
    const pa = req.query.pa;
    const am = req.query.am;
    const tn = req.query.tn;

    if(!pa || !am || !tn) return res.status(400).send("Missing parameters");

    const upi_url = `upi://pay?pa=${pa}&pn=YourName&am=${am}&cu=INR&tn=${tn}`;

    try {
        const qrImage = await QRCode.toDataURL(upi_url);
        const img = Buffer.from(qrImage.split(",")[1], 'base64');
        res.writeHead(200, {
            'Content-Type': 'image/png',
            'Content-Length': img.length
        });
        res.end(img);
    } catch (err) {
        res.status(500).send("Error generating QR");
    }
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Server running on port ${port}`));
