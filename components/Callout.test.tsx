import { render, screen } from '@testing-library/react';
import { Callout } from './Callout';

describe('Callout', () => {
  it('renders the default "tip" label and children content', () => {
    render(<Callout>Recuerda revisar los residuos del modelo.</Callout>);

    expect(screen.getByText('Tip')).toBeInTheDocument();
    expect(screen.getByText('Recuerda revisar los residuos del modelo.')).toBeInTheDocument();
  });

  it('uses a custom title when provided', () => {
    render(
      <Callout type="warning" title="Cuidado con la colinealidad">
        El VIF alto indica predictores redundantes.
      </Callout>
    );

    expect(screen.getByText('Cuidado con la colinealidad')).toBeInTheDocument();
    expect(screen.queryByText('Atención')).not.toBeInTheDocument();
  });

  it('falls back to the type label when no title is given', () => {
    render(<Callout type="success">Buen ajuste del modelo.</Callout>);

    expect(screen.getByText('Buena práctica')).toBeInTheDocument();
  });
});
