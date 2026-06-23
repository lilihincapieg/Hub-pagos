import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Pagination } from './Pagination';

const meta: Meta<typeof Pagination> = {
  title: 'Components/Pagination',
  component: Pagination,
  parameters: { layout: 'centered', docs: { description: { component: 'Page navigation component with smart page truncation.' } } },
  tags: ['autodocs'],
  args: { totalPages: 10, currentPage: 1, onPageChange: () => {} },
};

export default meta;
type Story = StoryObj<typeof Pagination>;

export const Default: Story = {};
export const MiddlePage: Story = { args: { currentPage: 5 } };
export const LastPage: Story = { args: { currentPage: 10 } };
export const FewPages: Story = { args: { totalPages: 3, currentPage: 1 } };
export const WithPageSize: Story = { args: { showPageSize: true, pageSize: 10, totalItems: 243 } };

export const Interactive: Story = {
  render: () => {
    const [page, setPage] = useState(1);
    return <Pagination currentPage={page} totalPages={20} onPageChange={setPage} />;
  },
};
