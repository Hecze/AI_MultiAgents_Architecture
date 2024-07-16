'use server';

import { CoreMessage, streamObject } from 'ai';
import { openai } from '@ai-sdk/openai';
import { createStreamableValue } from 'ai/rsc';
import { z } from 'zod';

export async function generate(messages: CoreMessage[]) {
  'use server';

  const stream = createStreamableValue();

  (async () => {
    const { partialObjectStream } = await streamObject({
      model: openai('gpt-3.5-turbo'),
      system: `Eres un narrador de crímenes interactivo con un investigador. Devuelve la orientación de la historia y 3 opciones en JSON.

      Instrucciones:
      1. No asumas conocimiento previo del investigador.
      2. Introduce nuevos personajes con una descripción clara y breve cuando aparezcan por primera vez.
      3. Los criminales son inteligentes, manipuladores y evasivos.
      4. No utilizes juicios de valor.
      5. Los criminales son peligrosos y pueden matar si se ven acorralados, no dejaran testigos vivos.
      6. La narrativa debe ser de crimen, miedo, intriga y realismo.
      7. El investigador está en desventaja, no sabe usar armas, y debe usar estrategia para ganar.
      8. La narrativa puede ser terrorífica en momentos peligrosos; el investigador puede sentir miedo y es vulnerable.
      9. Casi no hay registros de los criminales; solo se conocen rumores.
      10. La trama es para adultos: crimen, miedo, intriga y realista.
      12. La policia trata despéctivamente al investigador a menos que tenga pruebas contundentes.
      13. La opciones deben ser realizables en la situacion actual.
      14. Hay momentos en donde las opciones disponibles no te permitan hacer nada, por ejemplo si estas secuestrado o amarrado.
      15. Advertir ante una situacion peligrosa y poder evitarla en las opciones.
      
      Reglas:
      1. El juego solo termina en 2 escenarios: el investigador muere o El investigador resuelve la investigación.
      2. Cuando el juego termine devuelve las opciones como strings vacias
      3. Tienes un tiempo limitado para tomar las decisiones.
      4. Si el investigador no responde,la trama se desenvuelve`,

      messages: messages,
      maxTokens: 200,
      schema: z.object({
        notification: z.object({
          "consequence": z.string().describe('Consecuencia tras la acción anterior.. Máximo 400 caracteres'),
          "option 1": z.string().describe('Primera opción posible. Simplemente "..." si no hay opciones realizables. Máximo 50 caracteres'),
          "option 2": z.string().describe('Segunda opción posible. Máximo 50 caracteres'),
          "option 3": z.string().describe('Tercera opción posible. Máximo 50 caracteres'),
        }),
      }),
    });

    for await (const partialObject of partialObjectStream) {
      stream.update(partialObject);
    }

    stream.done();
  })();

  return { object: stream.value };
}



