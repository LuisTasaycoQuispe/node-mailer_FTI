const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const PDFDocument = require("pdfkit");


const corsOptions = {
  origin: 'https://evaluacion-viajes.netlify.app', 
  optionsSuccessStatus: 200 
};


const app = express();
app.use(cors(corsOptions))
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
                to: "marco.paredes@fiestatoursperu.com",
                subject: `Evaluacion Viaje - ${nombre}`,
                html: `
                    <div style="background:#f4f6f5; padding:20px 0;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif;">
                        <tr>
                        <td align="center">

                            <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff; border-radius:8px; padding:20px;">
                            
                            <!-- Titulo -->
                            <tr>
                                <td align="center" style="padding-bottom:10px;">
                                <h2 style="color:#2e7d32; margin:0;">RESUMEN DE EVALUACIÓN</h2>
                                </td>
                            </tr>

                            <!-- Datos -->
                            <tr>
                                <td align="center" style="font-size:14px; color:#555;">
                                <strong>${nombre}</strong><br>
                                ${email}<br>
                                ${fecha}
                                </td>
                            </tr>

                            <tr><td height="15"></td></tr>

                            <!-- Hotel Transfer -->
                            <tr>
                                <td>
                                <h3 style="color:#2e7d32;">Hotel Transfer</h3>
                                <table width="100%">
                                    ${hotelTransfer.map(i => `
                                    <tr>
                                        <td style="padding:6px 0; border-bottom:1px solid #eee;">
                                        ${i.hotelTransfer_name || "-"}
                                        </td>
                                        <td align="right" style="padding:6px 0; border-bottom:1px solid #eee; font-weight:bold;">
                                        ${i.hotelTransfer_calificacion || "-"}
                                        </td>
                                    </tr>
                                    `).join("")}
                                </table>
                                </td>
                            </tr>

                            <!-- Tours -->
                            <tr>
                                <td style="padding-top:15px;">
                                <h3 style="color:#2e7d32;">Tours y Guías</h3>
                                <table width="100%">
                                    ${tours.map(i => `
                                    <tr>
                                        <td style="padding:6px 0; border-bottom:1px solid #eee;">
                                        ${i.tours_name || "-"}
                                        </td>
                                        <td align="right" style="padding:6px 0; border-bottom:1px solid #eee; font-weight:bold;">
                                        ${i.tours_calificacion || "-"}
                                        </td>
                                    </tr>
                                    `).join("")}
                                </table>
                                </td>
                            </tr>

                            <!-- Hoteles -->
                            <tr>
                                <td style="padding-top:15px;">
                                <h3 style="color:#2e7d32;">Hoteles</h3>
                                <table width="100%">
                                    ${hotel.map(i => `
                                    <tr>
                                        <td style="padding:6px 0; border-bottom:1px solid #eee;">
                                        ${(i.hotel_ubicacion || "-")} - ${(i.hotel_name || "-")}
                                        </td>
                                        <td align="right" style="padding:6px 0; border-bottom:1px solid #eee; font-weight:bold;">
                                        ${i.hotel_calificacion || "-"}
                                        </td>
                                    </tr>
                                    `).join("")}
                                </table>
                                </td>
                            </tr>

                            <!-- Restaurantes -->
                            <tr>
                                <td style="padding-top:15px;">
                                <h3 style="color:#2e7d32;">Restaurantes</h3>
                                <table width="100%">
                                    ${restaurantes.map(i => `
                                    <tr>
                                        <td style="padding:6px 0; border-bottom:1px solid #eee;">
                                        ${(i.restaurante_ubicacion || "-")} - ${(i.restaurante_name || "-")}
                                        </td>
                                        <td align="right" style="padding:6px 0; border-bottom:1px solid #eee; font-weight:bold;">
                                        ${i.restaurante_calificacion || "-"}
                                        </td>
                                    </tr>
                                    `).join("")}
                                </table>
                                </td>
                            </tr>

                            <!-- Comentarios -->
                            <tr>
                                <td style="padding-top:15px;">
                                <h3 style="color:#2e7d32;">Comentarios</h3>
                                <div style="background:#f5f5f5; padding:10px; border-radius:6px; font-size:14px;">
                                    ${comentario || "Sin comentarios"}
                                </div>
                                </td>
                            </tr>

                            <!-- Calificación -->
                            <tr>
                                <td align="center" style="padding-top:20px;">
                                <h3 style="color:#2e7d32; margin:0;">
                                    Calificación general: ${calificacion}
                                </h3>
                                </td>
                            </tr>

                            <!-- Footer -->
                            <tr>
                                <td align="center" style="padding-top:20px; font-size:12px; color:#888;">
                                Gracias por elegir Peru Luxury Journeys
                                </td>
                            </tr>

                            </table>

                        </td>
                        </tr>
                    </table>
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

        doc.moveDown(0.4);


        doc.fillColor("#6d6d6d")
            .fontSize(10)
            .font("Helvetica")
            .text(`Pasj: ${nombre}` || "-", { align: "start" })
            .text(`Correo: ${email}` || "-", { align: "start" })
            .text(`Fecha: ${fecha}` || "-", { align: "start" });

        


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

        doc.fillColor("#1f1f1f")
            .font("Helvetica-Bold")
            .fontSize(12)
            .text(`Calificación general: ${calificacion} /10`, {
                align: "center"
            });

        doc.moveDown(2);

        doc.fillColor("#aaa")
            .fontSize(9)
            .text("Fiesta Tours Peru & Peru Luxury Journeys", {
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