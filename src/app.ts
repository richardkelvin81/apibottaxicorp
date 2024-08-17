
import { createBot, createFlow, MemoryDB, createProvider, addKeyword } from "@bot-whatsapp/bot"
import { BaileysProvider, handleCtx } from "@bot-whatsapp/provider-baileys"
import cors from 'cors';

const flowBienvenida = addKeyword('hola').addAnswer('¡Cómo estás!, bienvenido a TAXI CORP');

const main = async () => {
    const provider = createProvider(BaileysProvider);
    provider.initHttpServer(3001);

    const corsMiddleware = cors();

    provider.http?.server.post('/enviar-whatsapp', (req, res) => {
        corsMiddleware(req, res, () => handleCtx(async (bot, req, res) => {
            const phone = req.body.phone;
            const message = req.body.message;
            await bot.sendMessage(phone, message, {});
            res.end('Mensaje enviado desde servidor DonWeb');
        })(req, res));
    });

    await createBot({
        flow: createFlow([flowBienvenida]),
        database: new MemoryDB(),
        provider
    });
}

main();