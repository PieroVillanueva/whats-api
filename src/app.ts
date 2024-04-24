import { createBot, createProvider, MemoryDB, createFlow, addKeyword } from '@bot-whatsapp/bot'
import { BaileysProvider, handleCtx } from '@bot-whatsapp/provider-baileys'

const flowBienvenida = addKeyword('holaa').addAnswer('bienvenido')

const main = async () => {
    const provider = createProvider(BaileysProvider)
    provider.initHttpServer(3004)
    provider.http?.server.post("/enviar", handleCtx(async (bot, req, res) => {

        try {
            const timeoutMs = 10000; // 30 segundos
            const timeoutId = setTimeout(() => {
                // Si se alcanza el tiempo límite, envía una respuesta de error y termina la solicitud
                console.error("La solicitud ha excedido el tiempo límite");
                res.end("La solicitud ha excedido el tiempo límite");
            }, timeoutMs);
            const body = req.body
            const telefono = body.telefono
            const mensaje = body.mensaje
            await bot.sendMessage(telefono, mensaje, { })

            clearTimeout(timeoutId);
            res.end('esto es el server')
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
            res.end("Hubo un error al procesar la solicitud");
        }

    }))
    await createBot({
        flow: createFlow([flowBienvenida]),
        database: new MemoryDB(),
        provider
    })
}

main()