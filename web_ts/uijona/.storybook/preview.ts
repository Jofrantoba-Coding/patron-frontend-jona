import type { Preview } from '@storybook/react';
import '../src/styles/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'centered',
    backgrounds: {
      default: 'light',
      values: [
        { name: 'light',  value: '#ffffff' },
        { name: 'gray',   value: '#f5f5f5' },
        { name: 'dark',   value: '#1e1e1e' },
      ],
    },
  },
};

export default preview;
