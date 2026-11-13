import type { LLMProvider, LLMMessage, LLMChatOptions } from '../../types/blackboard';

const CONTRACT_RESPONSE = `**Respuesta breve**
Un modelo lineal mixto (LMM) extiende la regresión incluyendo efectos aleatorios que capturan la correlación entre observaciones del mismo sujeto.

**Definición / Formulación**
$$y_{ij} = \\beta_0 + \\beta_1 x_{ij} + b_{0i} + \\varepsilon_{ij}, \\quad b_{0i} \\sim N(0, \\tau^2), \\; \\varepsilon_{ij} \\sim N(0, \\sigma^2)$$

**Ejemplo en R**
\`\`\`r
library(lme4)
# supuesto: datos en formato largo con columna id de sujeto
modelo <- lmer(y ~ x + (1 | id), data = datos)
summary(modelo)
\`\`\`

**Interpretación**
$\\beta_0$ es el intercepto poblacional y $b_{0i}$ el desvío del sujeto $i$; $\\tau^2$ mide heterogeneidad entre sujetos.

**Referencias**
[sin fuentes del corpus en este turno — respuesta de conocimiento general]`;

const PLOT_RESPONSE = `**Ejemplo en R**
\`\`\`r
library(ggplot2)
ggplot(datos, aes(x = tiempo, y = y, group = id)) +
  geom_line(alpha = 0.4) +
  geom_point(alpha = 0.4) +
  labs(title = "Perfiles individuales")
\`\`\`

**Referencias**
[sin fuentes del corpus en este turno — respuesta de conocimiento general]`;

export class MockProvider implements LLMProvider {
  id = 'none' as const;

  private pick(messages: LLMMessage[]): string {
    const lastUser = messages.filter((m) => m.role === 'user').at(-1)?.content ?? '';
    if (/graficar|plot/i.test(lastUser)) return PLOT_RESPONSE;
    return CONTRACT_RESPONSE;
  }

  async *chat(messages: LLMMessage[], options: LLMChatOptions): AsyncIterable<string> {
    for (const chunk of this.pick(messages).match(/[\s\S]{1,40}/g) ?? []) {
      if (options.signal?.aborted) break;
      yield chunk;
    }
  }

  chatOnce(
    messages: LLMMessage[],
    _options: LLMChatOptions & { tools?: unknown[] },
  ): Promise<{ content: string; toolCalls: { id: string; name: string; arguments: string }[] }> {
    return Promise.resolve({ content: this.pick(messages), toolCalls: [] });
  }

  listModels(): Promise<string[]> {
    return Promise.resolve(['mock-model']);
  }

  supportsVision(): boolean {
    return true;
  }

  dispose(): void {
    // no resources to release
  }
}
