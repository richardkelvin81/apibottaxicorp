import express from 'express';
import cors from 'cors';
import { createBot, createFlow, MemoryDB, createProvider, addKeyword } from "@bot-whatsapp/bot";
import { BaileysProvider, handleCtx } from "@bot-whatsapp/provider-baileys";

const flowBienvenida = addKeyword('hola').addAnswer('¡Cómo estás!, bienvenido a TAXI CORP');

const main = async () => {
    const provider = createProvider(BaileysProvider);
    provider.initHttpServer(3001);

    const app = express();

    // Habilitar CORS para todas las rutas
    app.use(cors());

    provider.http?.server.post('/enviar-whatsapp', (req, res) => {
        handleCtx(async (bot, req, res) => {
            const phone = req.body.phone;
            const message = req.body.message;
            await bot.sendMessage(phone, message, {});
            res.end('Mensaje enviado desde servidor DonWeb');
        })(req, res);
    });

    await createBot({
        flow: createFlow([flowBienvenida]),
        database: new MemoryDB(),
        provider
    });
}

main();