import { fireEvent, render, screen } from '@testing-library/react';
import { CodeBlock } from './CodeBlock';

jest.mock('@uiw/react-codemirror', () => ({
  __esModule: true,
  default: ({ value }: { value: string }) => <pre>{value}</pre>,
}));

describe('CodeBlock', () => {
  it('shows the language badge and the code', () => {
    render(<CodeBlock code={'m <- lme(y ~ t, random = ~ 1 | id)'} lang="r" />);
    expect(screen.getByText('R')).toBeInTheDocument();
    expect(screen.getByText(/m <- lme/)).toBeInTheDocument();
  });

  it('copies the exact code to the clipboard', async () => {
    const writeText = jest.fn().mockResolvedValue(undefined);
    Object.assign(navigator, { clipboard: { writeText } });
    const code = 'library(sommer)\nfit <- mmer(y ~ env, random = ~ vsm(ism(g)))';

    render(<CodeBlock code={code} lang="r" />);
    fireEvent.click(screen.getByRole('button', { name: /copiar código/i }));

    expect(writeText).toHaveBeenCalledWith(code);
    expect(await screen.findByText('Copiado')).toBeInTheDocument();
  });
});
