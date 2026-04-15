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
    // Extraemos los datos con valores por defecto (evita errores si el campo no llega)
    const { 
        nombre = "Sin Nombre", 
        email, 
        fecha = "No especificada", 
        hotelTransfer = [], 
        restaurantes = [], 
        tours = [], 
        hotel = [], 
        comentario = "Sin comentarios", 
        calificacion = 0 
    } = req.body;

    try {
        // 1. Envío de notificación interna
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

            // 2. Envío del PDF al cliente
            if (email) { // Solo enviamos si hay un correo de destino
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
            }

            res.json({ mensaje: '¡Evaluación procesada con éxito!' });
        });

        // --- CONSTRUCCIÓN DEL PDF ---
        doc.fillColor("#244365").font("Helvetica-Bold").fontSize(22).text("RESUMEN DE EVALUACIÓN", { align: "center" });
        doc.moveDown();

        doc.fillColor("#333").fontSize(12).text(`Nombre: ${nombre}`);
        doc.text(`Email: ${email || "No proporcionado"}`);
        doc.text(`Fecha de Viaje: ${fecha}`);
        doc.moveDown();

        // Función auxiliar para dibujar tablas solo si hay datos
        const dibujarSeccion = (titulo, datos, headers, keys) => {
            // Filtramos datos vacíos (por ejemplo, si llegan objetos con strings vacíos o "No evaluado")
            const datosValidos = datos.filter(item => 
                Object.values(item).some(val => val !== "" && val !== "No evaluado")
            );

            if (datosValidos.length > 0) {
                doc.fontSize(14).fillColor("#244365").text(titulo);
                doc.moveDown(0.5);
                doc.fontSize(10).fillColor("black");
                
                doc.text(headers[0], 50, doc.y, { continued: true });
                doc.text(headers[1], 300, doc.y);
                doc.moveTo(50, doc.y).lineTo(550, doc.y).stroke();
                doc.moveDown(0.5);

                datosValidos.forEach((item) => {
                    let label = keys.length > 2 
                        ? `${item[keys[0]]} - ${item[keys[1]]}` 
                        : item[keys[0]];
                    let valor = keys.length > 2 ? item[keys[2]] : item[keys[1]];

                    doc.text(String(label || "N/A"), 50, doc.y, { continued: true });
                    doc.text(String(valor || "No evaluado"), 300, doc.y);
                    doc.moveDown(0.5);
                });
                doc.moveDown();
            }
        };

        // Renderizado condicional de cada sección
        dibujarSeccion("Calificaciones de Hoteles (Transfer)", hotelTransfer, ["UBICACION", "CALIFICACION"], ["hotelTransfer_name", "hotelTransfer_calificacion"]);
        
        dibujarSeccion("Tours y Guías Turísticos", tours, ["TOURS", "CALIFICACION"], ["tours_name", "tours_calificacion"]);
        
        dibujarSeccion("Hoteles en Ciudad", hotel, ["HOTEL", "CALIFICACION"], ["hotel_name", "hotel_calificacion"]);
        
        dibujarSeccion("Restaurantes", restaurantes, ["RESTAURANTE", "CALIFICACION"], ["restaurante_ubicacion", "restaurante_name", "restaurante_calificacion"]);

        // Comentarios
        if (comentario && comentario !== "Sin comentarios") {
            doc.fontSize(14).fillColor("#244365").text("Comentarios Generales y/o Sugerencias");
            doc.moveDown(0.5);
            doc.fontSize(10).fillColor("#1c1c1c").text(comentario);
            doc.moveDown();
        }

        doc.fontSize(14).fillColor("#112228").text(`Calificación Global: ${calificacion} / 10`);
        doc.moveDown(2);
        doc.fontSize(10).fillColor("gray").text("Gracias por elegir Peru Luxury Journeys.", { align: "center" });

        doc.end();

    } catch (error) {
        console.error("ERROR:", error);
        res.status(500).json({ mensaje: 'Error al procesar la evaluación' });
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});