const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');
const PDFDocument = require("pdfkit");

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
    const { nombre, email, fecha, hotelTransfer, restaurantes,tours, hotel, comentario, calificacion } = req.body;


    try {
        await transporter.sendMail({
            from: `"Web Contacto" <${EMAIL_USER}>`,
            to: EMAIL_USER,
            subject: 'Nueva evaluación de viaje recibida',
            html: `<h2>Nueva solicitud de ${nombre}</h2><p>Fecha: ${fecha}</p>`
        });

        const doc = new PDFDocument({ margin: 40 });
        let buffers = [];
        doc.on("data", buffers.push.bind(buffers));

        doc.on("end", async () => {
            const pdfData = Buffer.concat(buffers);

            await transporter.sendMail({
                from: `"Peru Luxury Journeys" <${EMAIL_USER}>`,
                to: email,
                subject: 'Your Travel Evaluation Summary',
                html: `
                <div style="font-family: Arial, sans-serif; color: #333;">
                    <h1 style="color: #0d3b66;">Thank you, ${nombre}!</h1>
                    <p>We have received your evaluation. Please find the summary attached as a PDF.</p>
                    <hr>
                    <p><small>© 2026 Peru Luxury Journeys | Lima, Perú</small></p>
                </div>`,
                attachments: [{ filename: `evaluacion-${nombre}.pdf`, content: pdfData }]
            });

            res.json({ mensaje: '¡Correo enviado con éxito!' });
        });

        doc.fillColor("#0d3b66").fillColor("#244365").font("Helvetica-Bold").fontSize(22).text("RESUMEN DE EVALUACIÓN", { align: "center" });
        doc.moveDown();

        doc.fillColor("#333").fontSize(12).text(`Nombre: ${nombre || "Sin Nombre"}`);
        doc.text(`Email: ${email || "Sin correo"}`);
        doc.text(`Fecha de Viaje: ${fecha || "No Fecha"}`);
        doc.moveDown();


        doc.fontSize(14).fillColor("#244365").text("Calificaciones de Hoteles");
        doc.moveDown(0.5);

        doc.fontSize(10).fillColor("black");
        doc.text("UBICACION/HOTEL", 50, doc.y, { continued: true });
        doc.text("CALIFICACION", 300, doc.y);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);

          hotelTransfer.forEach((ht) => {
            doc.text(ht.hotelTransfer_name, 50, doc.y, { continued: true });
            doc.text(ht.hotelTransfer_calificacion, 300, doc.y);
            doc.moveDown(0.5);
         });
        doc.moveDown();


        doc.fontSize(14).fillColor("#244365").text("Calificacion de Tours y Guias Turisticos");
        doc.moveDown(0.5);

        doc.fontSize(10).fillColor("black");
        doc.text("TOURS", 50, doc.y, { continued: true });
        doc.text("CALIFICACION", 300, doc.y);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);

         tours.forEach((t) => {
            doc.text(t.tours_name, 50, doc.y, { continued: true });
            doc.text(t.tours_calificacion, 300, doc.y);
            doc.moveDown(0.5);
        });
        doc.moveDown();

        doc.fontSize(14).fillColor("#244365").text("Calificacion Hoteles, ciudad y Nombre Hotel");
        doc.moveDown(0.5);

        doc.fontSize(10).fillColor("black");
        doc.text("HOTEL", 50, doc.y, { continued: true });
        doc.text("CALIFICACION", 300, doc.y);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);

        hotel.forEach((h) => {
            doc.text(`${h.hotel_ubicacion} - ${h.hotel_name}`, 50, doc.y, { continued: true });
            doc.text(h.hotel_calificacion, 300, doc.y);
            doc.moveDown(0.5);
        });
        doc.moveDown();



        doc.fontSize(14).fillColor("#244365").text("Restaurantes");
        doc.moveDown(0.5);

        doc.fontSize(10).fillColor("black");
        doc.text("RESTAURANTE", 50, doc.y, { continued: true });
        doc.text("CALIFICACION", 300, doc.y);
        doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);

        restaurantes.forEach((r) => {
            doc.text(`${r.restaurante_ubicacion} - ${r.restaurante_name}`, 50, doc.y, { continued: true });
            doc.text(r.restaurante_calificacion, 300, doc.y);
            doc.moveDown(0.5);
        });
        doc.moveDown();



        doc.fontSize(14).fillColor("#244365").text("Comentarios Generales y/o Sugerencias");
        doc.moveDown(1);
        doc.fontSize(10).fillColor("#1c1c1c").text(comentario);
        doc.moveDown();

        doc.fontSize(14).fillColor("#112228").text(`Califiacion de Servicios Brindado: ${calificacion}`);
        doc.moveDown(1);


        doc.moveDown();
        doc.fontSize(10).fillColor("gray").text("Gracias por elegir Peru Luxury Journeys.", { align: "center" });

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