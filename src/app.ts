// Después (ES6)
import express from 'express';
import cors from 'cors';
import { createBot, createFlow, MemoryDB, createProvider, addKeyword } from "@bot-whatsapp/bot";
import { BaileysProvider, handleCtx } from "@bot-whatsapp/provider-baileys";

const app = express();
const flowBienvenida = addKeyword('hola').addAnswer('¡Cómo estás!, bienvenido a TAXI CORP');

app.use(cors()); // Habilitar CORS para todas las rutas

app.post('/enviar-whatsapp', (req, res) => {
    handleCtx(async (bot, req, res) => {
        const phone = req.body.phone;
        const message = req.body.message;
        await bot.sendMessage(phone, message, {});
        res.json({ message: 'Mensaje enviado desde servidor DonWeb' });
    })(req, res);
});

const provider = createProvider(BaileysProvider);
provider.initHttpServer(3001);

createBot({
    flow: createFlow([flowBienvenida]),
    database: new MemoryDB(),
    provider
});