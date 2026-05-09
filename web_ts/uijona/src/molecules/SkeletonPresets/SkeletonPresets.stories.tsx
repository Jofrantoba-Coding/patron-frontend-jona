import type { Meta, StoryObj } from '@storybook/react';
import { SkeletonCard, SkeletonUserRow, SkeletonTableRows, SkeletonForm } from './SkeletonPresets';

const meta: Meta = {
  title: 'Molecules/SkeletonPresets',
  tags: ['autodocs'],
};
export default meta;

export const Card: StoryObj = {
  render: () => <div style={{ width: '360px' }}><SkeletonCard /></div>,
};

export const UserRow: StoryObj = {
  render: () => <div style={{ width: '360px' }}><SkeletonUserRow /></div>,
};

export const TableRows: StoryObj = {
  render: () => <div style={{ width: '500px' }}><SkeletonTableRows rows={4} /></div>,
};

export const Form: StoryObj = {
  render: () => <div style={{ width: '360px' }}><SkeletonForm fields={3} /></div>,
};
