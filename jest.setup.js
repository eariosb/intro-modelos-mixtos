import '@testing-library/jest-dom';

// React 18 act() support across the whole suite (async dispatches inside
// effects otherwise warn and misbehave outside explicit act blocks).
globalThis.IS_REACT_ACT_ENVIRONMENT = true;
