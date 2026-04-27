const express = require('express');
const nodemailer = require('nodemailer');
const PDFDocument = require("pdfkit");
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const EMAIL_USER = "noreply.fiestatoursperu@gmail.com";
const EMAIL_PASS = "ztcn lsxw sbwy mktw";

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
    const {
        nombre, email, fecha,
        hotelTransfer = [], restaurantes = [],
        tours = [], hotel = [],
        comentarioHotelTransfer,
        comentarioRestaurante,
        comentarioHotel,
        comentariosToursGuia,
        comentario,
        calificacion
    } = req.body;

    try {

        const doc = new PDFDocument({ margin: 50 });
        let buffers = [];

        doc.on("data", buffers.push.bind(buffers));

        doc.on("end", async () => {
            const pdfData = Buffer.concat(buffers);
// marco.paredes@fiestatoursperu.com
// repevacusco@gmail.com
            await transporter.sendMail({
                from: `"Fiesta Tours Peru" <${EMAIL_USER}>`,
                to: "repevacusco@gmail.com, marco.paredes@fiestatoursperu.com",
                // to: "dw@fiestatoursperu.com",
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
                    <td align="start" style="font-size:14px; color:#555;">
                    <br>
                    <strong><span style="color:green">Nombre: </span> ${nombre}</strong>
                    <br>
                     <strong><span style="color:green">Fecha: </span> ${fecha}
                    </td>
                    </tr>


                    <!-- HOTEL TRANSFER -->
                    <tr>
                    <td>
                    <h3 style="color:#2e7d32;">Hotel Transfer</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
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

                    <tr>
                    <td style="padding-top:10px;">
                    <h3 style="color:#2e7d32;">Comentario Hotel Transfer</h3>
                    <div style="background:#f9fbf9; border-left:4px solid #2e7d32; padding:10px; border-radius:6px; font-size:14px;">
                    ${comentarioHotelTransfer || "<i style='color:#999;'>Sin comentarios</i>"}
                    </div>
                    </td>
                    </tr>

                    <tr><td style="border-bottom:1px solid gray"></td></tr>


                    <!-- TOURS -->
                    <tr>
                    <td>
                    <h3 style="color:#2e7d32;">Tours y Guías</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
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

                    <tr>
                    <td style="padding-top:10px;">
                    <h3 style="color:#2e7d32;">Comentario Tours</h3>
                    <div style="background:#f9fbf9; border-left:4px solid #2e7d32; padding:10px; border-radius:6px; font-size:14px;">
                    ${comentariosToursGuia || "<i style='color:#999;'>Sin comentarios</i>"}
                    </div>
                    </td>
                    </tr>

                    <tr><td style="border-bottom:1px solid gray"></td></tr>


                    <tr>
                    <td>
                    <h3 style="color:#2e7d32;">Hoteles</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
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

                    <tr>
                    <td style="padding-top:10px;">
                    <h3 style="color:#2e7d32;">Comentario Hotel</h3>
                    <div style="background:#f9fbf9; border-left:4px solid #2e7d32; padding:10px; border-radius:6px; font-size:14px;">
                    ${comentarioHotel || "<i style='color:#999;'>Sin comentarios</i>"}
                    </div>
                    </td>
                    </tr>

                   <tr><td style="border-bottom:1px solid gray"></td></tr>

                    <tr>
                    <td>
                    <h3 style="color:#2e7d32;">Restaurantes</h3>
                    <table width="100%" cellpadding="0" cellspacing="0">
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

                    <tr>
                    <td style="padding-top:10px;">
                    <h3 style="color:#2e7d32;">Comentario Restaurante</h3>
                    <div style="background:#f9fbf9; border-left:4px solid #2e7d32; padding:10px; border-radius:6px; font-size:14px;">
                    ${comentarioRestaurante || "<i style='color:#999;'>Sin comentarios</i>"}
                    </div>
                    </td>
                    </tr>

                    <tr><td style="border-bottom:1px solid gray"></td></tr>


                    <!-- COMENTARIO GENERAL -->
                    <tr>
                    <td>
                    <h3 style="color:#2e7d32;">Comentarios</h3>
                    <div style="background:#f4f6f5; border:1px solid #e0e0e0; padding:12px; border-radius:6px; font-size:14px;">
                    ${comentario || "<i style='color:#999;'>Sin comentarios</i>"}
                    </div>
                    </td>
                    </tr>



                    <!-- Datos Email -->
                    <tr>
                    <td>
                    <h3 style="color:#105A40;">Email</h3>
                    <div style="background:#f4f6f5; border:1px solid #e0e0e0; padding:12px; border-radius:6px; font-size:14px;">
                    ${email || " - "}
                    </div>
                    </td>
                    </tr>

                    <tr>
                    <td align="center">
                    <h3 style="color:#2e7d32; margin:0;">
                    Calificación general: ${calificacion}
                    </h3>
                    </td>
                    </tr>

                    <tr><td height="20"></td></tr>

                    <tr>
                    <td align="center" style="font-size:12px; color:#888;">
                    Fiesta Tours Peru & Peru Luxury Journeys
                    </td>
                    </tr>

                    </table>

                    </td>
                    </tr>
                    </table>
                    </div>

                `,
                attachments: [
                    {
                        filename: `evaluacion-${nombre}.pdf`,
                        content: pdfData
                    }
                ]
            });

            res.json({ mensaje: '¡Correo enviado con éxito!' });
        });

        const green = "#2e7d32";
        const gray = "#666";

        const checkPageBreak = (margin = 80) => {
            if (doc.y > doc.page.height - margin) {
                doc.addPage();
            }
        };

        doc.fillColor("#223e58")
            .font("Helvetica-Bold")
            .fontSize(18)
            .text("Resumen de Evaluación", { align: "center" });

        doc.moveDown(1);


         doc
        .fillColor('green')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Nombre: ', { continued: true });
        
        doc
        .fillColor("#3f3f3f")
        .font('Helvetica-Bold')
        .fontSize(12)
        .text(nombre);

        doc.moveDown(1);
         doc
        .fillColor('green')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Fecha: ', { continued: true });
        
        doc
        .fillColor("#3f3f3f")
        .font('Helvetica-Bold')
        .fontSize(12)
        .text(fecha);

       
        doc.moveDown(2);

        const drawSection = (titulo, data, getName, getValue) => {
            checkPageBreak();

            doc.fillColor(green)
                .font("Helvetica-Bold")
                .fontSize(12)
                .text(titulo);

            doc.moveDown(0.5);

            const startX = 60;
            const endX = 500;

            data.forEach(item => {
                checkPageBreak();

                const y = doc.y;

                doc.fillColor("#000")
                    .fontSize(10)
                    .font("Helvetica")
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

        const drawComment = (titulo, texto) => {
            checkPageBreak();

            doc.fillColor(green)
                .font("Helvetica-Bold")
                .fontSize(12)
                .text(titulo);

            doc.moveDown(0.3);

            doc.fillColor("#333")
                .font("Helvetica")
                .fontSize(10)
                .text(texto || "Sin comentarios", {
                    width: 480
                });

            doc.moveDown(2);
        };

        drawSection("Hotel Transfer", hotelTransfer,
            i => i.hotelTransfer_name || "-",
            i => i.hotelTransfer_calificacion || "-"
        );

        drawComment("Comentario Hotel Transfer", comentarioHotelTransfer);

        drawLine(doc);
        doc.moveDown(2);


        drawSection("Tours y Guías", tours,
            i => i.tours_name || "-",
            i => i.tours_calificacion || "-"
        );

        drawComment("Comentario Tours Guia", comentariosToursGuia);

        drawLine(doc);
        doc.moveDown(2);


        drawSection("Hoteles", hotel,
            i => `${i.hotel_ubicacion || "-"} - ${i.hotel_name || "-"}`,
            i => i.hotel_calificacion || "-"
        );

        drawComment("Comentario Hotel", comentarioHotel);

        drawLine(doc);
        doc.moveDown(2);


        drawSection("Restaurantes", restaurantes,
            i => `${i.restaurante_ubicacion || "-"} - ${i.restaurante_name || "-"}`,
            i => i.restaurante_calificacion || "-"
        );

        drawComment("Comentario Restaurantes", comentarioRestaurante);
        drawLine(doc);
        doc.moveDown(2);

        drawComment("Comentarios Generales", comentario);
        
        doc.moveDown(2);


        doc
        .fillColor('green')
        .fontSize(10)                
        .font("Helvetica-Bold")

        .text('Email: ', { continued: true });

        checkPageBreak();

        doc
        .fillColor("#3f3f3f")
        .font("Helvetica-Bold")

        .text(email || '-');

        doc.moveDown(4);

        doc.fillColor("#1f1f1f")
            .font("Helvetica-Bold")
            .fontSize(12)
            .text(`Calificación general: ${calificacion} /10`, {
                align: "center"
            });

        doc.moveDown(2);

        doc.fillColor("#646464")
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



function drawLine(doc) {
  doc.moveDown(0.5);

  doc.strokeColor('#cccccc')
     .lineWidth(1)
     .moveTo(50, doc.y)
     .lineTo(550, doc.y)
     .stroke();

  doc.moveDown(0.5);
}

const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});