import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// Las pruebas de hidratación llaman a act() sin Testing Library: React lo exige declarado.
(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

afterEach(cleanup);
