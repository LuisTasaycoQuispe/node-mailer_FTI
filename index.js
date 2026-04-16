const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const PDFDocument = require("pdfkit");


const corsOptions = {
  origin: 'https://evaluacion-viajes.netlify.app', 
  optionsSuccessStatus: 200 
};

app.use(cors(corsOptions))

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const EMAIL_USER = "luistasayco3030@gmail.com";
const EMAIL_PASS = "xkii szmn wopp rqdr";

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS,
    }
});

app.post('/evaluacion', async (req, res) => {
    const { nombre, email, fecha, hotelTransfer = [], restaurantes = [], tours = [], hotel = [], comentarioHotelTransfer,comentarioRestaurante, comentarioHotel, comentariosToursGuia,comentario, calificacion } = req.body;

    try {
         const doc = new PDFDocument({ margin: 50 });
        let buffers = [];

        doc.on("data", buffers.push.bind(buffers));

        doc.on("end", async () => {
            const pdfData = Buffer.concat(buffers);


            await transporter.sendMail({
                from: `"Fiesta Tours Peru" <${EMAIL_USER}>`,
                to: "dw@fiestatoursperu.com",
                subject: 'Evaluacion Viaje',
                html: `
                
<div style="font-family: Arial, sans-serif; color:#333; max-width:600px; margin:auto;">
    
    <h2 style="text-align:center; color:#2e7d32;">RESUMEN DE EVALUACIÓN</h2>

    <p style="text-align:center;">
        <strong>${nombre}</strong><br>
        ${email}<br>
        ${fecha}
    </p>

    <hr>

    <h3 style="color:#2e7d32;">Hotel Transfer</h3>
    ${hotelTransfer.map(i => `
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding:4px 0;">
            <span>${i.hotelTransfer_name || "-"}</span>
            <strong>${i.hotelTransfer_calificacion || "-"}</strong>
        </div>
    `).join("")}

    <h3 style="color:#2e7d32; margin-top:15px;">Tours y Guías</h3>
    ${tours.map(i => `
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding:4px 0;">
            <span>${i.tours_name || "-"}</span>
            <strong>${i.tours_calificacion || "-"}</strong>
        </div>
    `).join("")}

    <h3 style="color:#2e7d32; margin-top:15px;">Hoteles</h3>
    ${hotel.map(i => `
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding:4px 0;">
            <span>${(i.hotel_ubicacion || "-") + " - " + (i.hotel_name || "-")}</span>
            <strong>${i.hotel_calificacion || "-"}</strong>
        </div>
    `).join("")}

    <h3 style="color:#2e7d32; margin-top:15px;">Restaurantes</h3>
    ${restaurantes.map(i => `
        <div style="display:flex; justify-content:space-between; border-bottom:1px solid #eee; padding:4px 0;">
            <span>${(i.restaurante_ubicacion || "-") + " - " + (i.restaurante_name || "-")}</span>
            <strong>${i.restaurante_calificacion || "-"}</strong>
        </div>
    `).join("")}

    <h3 style="color:#2e7d32; margin-top:15px;">Comentarios</h3>
    <p style="background:#f5f5f5; padding:10px; border-radius:6px;">
        ${comentario || "Sin comentarios"}
    </p>

    <h3 style="text-align:center; color:#2e7d32;">
        Calificación general: ${calificacion}
    </h3>

    <hr>

    <p style="text-align:center; font-size:12px; color:#888;">
        Gracias por elegir Peru Luxury Journeys
    </p>

</div>

                `,
                attachments: [{ filename: `evaluacion-${nombre}.pdf`, content: pdfData }]
            });

            res.json({ mensaje: '¡Correo enviado con éxito!' });
        });

        const green = "#2e7d32";
        const gray = "#666";
        const pageWidth = doc.page.width;
        const centerX = pageWidth / 2;

        // doc.image(path.join("path/logo-fti-esp.png"), centerX - 40, 30, { width: 80 });

        // doc.moveDown(4);

        doc.fillColor("#223e58")
            .font("Helvetica-Bold")
            .fontSize(18)
            .text("Resumen de Evaluación", { align: "center" });

        doc.moveDown(0.5);


        doc.moveDown(1);

        doc.fillColor(gray)
            .fontSize(10)
            .font("Helvetica")
            .text(nombre || "-", { align: "center" })
            .text(email || "-", { align: "center" })
            .text(fecha || "-", { align: "center" });

        doc.moveDown(2);

        const drawSection = (titulo, data, getName, getValue) => {
            doc.fillColor(green)
                .font("Helvetica-Bold")
                .fontSize(12)
                .text(titulo);

            doc.moveDown(0.5);

            const startX = 60;
            const endX = 500;

            data.forEach(item => {
                const y = doc.y;

                doc.fillColor("#000")
                    .font("Helvetica")
                    .fontSize(10)
                    .text(getName(item), startX, y, {
                        width: 300
                    });

                doc.fillColor(green)
                    .font("Helvetica-Bold")
                    .text(getValue(item), startX, y, {
                        width: endX - startX,
                        align: "right"
                    });

                doc.moveDown(0.4);

                doc.moveTo(startX, doc.y)
                    .lineTo(endX, doc.y)
                    .strokeColor("#eee")
                    .stroke();

                doc.moveDown(0.4);
            });

            doc.moveDown(1);
        };

        drawSection(
            "Hotel Transfer",
            hotelTransfer,
            (i) => i.hotelTransfer_name || "-",
            (i) => i.hotelTransfer_calificacion || "-"
        );

        doc.fillColor(green)
            .font("Helvetica-Bold")
            .fontSize(12)
            .text("Comentario Hotel Transfer");

        doc.moveDown(0.3);

        doc.fillColor("#333")
            .font("Helvetica")
            .fontSize(10)
            .text(comentarioHotelTransfer || "Sin comentarios", {
                width: 480,
                align: "left"
            });

        doc.moveDown(2);

        drawSection(
            "Tours y Guías",
            tours,
            (i) => i.tours_name || "-",
            (i) => i.tours_calificacion || "-"
        );

        doc.fillColor(green)
            .font("Helvetica-Bold")
            .fontSize(12)
            .text("Comentario Tours Guia");

        doc.moveDown(0.3);

        doc.fillColor("#333")
            .font("Helvetica")
            .fontSize(10)
            .text(comentariosToursGuia || "Sin comentarios", {
                width: 480,
                align: "left"
            });

        doc.moveDown(2);

        drawSection(
            "Hoteles",
            hotel,
            (i) => `${i.hotel_ubicacion || "-"} - ${i.hotel_name || "-"}`,
            (i) => i.hotel_calificacion || "-"
        );


        
        doc.fillColor(green)
            .font("Helvetica-Bold")
            .fontSize(12)
            .text("Comentario Hotel");

        doc.moveDown(0.3);

        doc.fillColor("#333")
            .font("Helvetica")
            .fontSize(10)
            .text(comentarioHotel || "Sin comentarios", {
                width: 480,
                align: "left"
            });

        doc.moveDown(2);


        drawSection(
            "Restaurantes",
            restaurantes,
            (i) => `${i.restaurante_ubicacion || "-"} - ${i.restaurante_name || "-"}`,
            (i) => i.restaurante_calificacion || "-"
        );
        
        doc.fillColor(green)
            .font("Helvetica-Bold")
            .fontSize(12)
            .text("Comentario Restaurantes");

        doc.moveDown(0.3);

        doc.fillColor("#333")
            .font("Helvetica")
            .fontSize(10)
            .text(comentarioRestaurante || "Sin comentarios", {
                width: 480,
                align: "left"
            });

        doc.moveDown(2);


        doc.fillColor(green)
            .font("Helvetica-Bold")
            .fontSize(12)
            .text("Comentarios Generales y/o Sugerencias");

        doc.moveDown(0.3);

        doc.fillColor("#333")
            .font("Helvetica")
            .fontSize(10)
            .text(comentario || "Sin comentarios", {
                width: 480,
                align: "left"
            });

        doc.moveDown(2);

        doc.fillColor("#000")
            .font("Helvetica-Bold")
            .fontSize(12)
            .text(`Calificación general: ${calificacion}`, {
                align: "center"
            });

        doc.moveDown(2);

        doc.fillColor("#aaa")
            .fontSize(9)
            .text("Gracias por confiar en Peru Luxury Journeys", {
                align: "center"
            });

        doc.end();

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno en el servidor' });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});