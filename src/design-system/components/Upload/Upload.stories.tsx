import type { Meta, StoryObj } from '@storybook/react';
import { Upload } from './Upload';

const meta: Meta<typeof Upload> = {
  title: 'Components/Upload',
  component: Upload,
  parameters: { layout: 'centered', docs: { description: { component: 'File upload dropzone with drag & drop, file list and status indicators.' } } },
  tags: ['autodocs'],
  argTypes: {
    disabled: { control: 'boolean' },
    multiple: { control: 'boolean' },
  },
  decorators: [(Story) => <div style={{ width: 420 }}><Story /></div>],
};

export default meta;
type Story = StoryObj<typeof Upload>;

export const Empty: Story = {};
export const Disabled: Story = { args: { disabled: true } };

export const WithFiles: Story = {
  args: {
    files: [
      { id: '1', name: 'factura-enero.pdf', size: 245000, status: 'idle' },
      { id: '2', name: 'contrato-proveedor.pdf', size: 1200000, status: 'idle' },
    ],
    onDownloadFile: () => {},
    onPreviewFile: () => {},
    onRemoveFile: () => {},
  },
};

export const WithProgress: Story = {
  args: {
    files: [
      { id: '1', name: 'archivo-grande.pdf', size: 5000000, status: 'uploading', progress: 62 },
    ],
    onRemoveFile: () => {},
  },
};

export const WithSuccess: Story = {
  args: {
    files: [
      { id: '1', name: 'documento.pdf', size: 312000, status: 'success' },
    ],
    onDownloadFile: () => {},
    onPreviewFile: () => {},
    onRemoveFile: () => {},
  },
};

export const WithError: Story = {
  args: {
    files: [
      { id: '1', name: 'archivo-invalido.exe', size: 80000, status: 'error', errorMessage: 'El archivo debe ser .xlsx, .xls o .csv' },
    ],
  },
};

export const Mixed: Story = {
  args: {
    files: [
      { id: '1', name: 'factura.pdf', size: 245000, status: 'success' },
      { id: '2', name: 'contrato.pdf', size: 1200000, status: 'uploading', progress: 45 },
      { id: '3', name: 'error.exe', size: 80000, status: 'error', errorMessage: 'Formato no permitido' },
    ],
    onDownloadFile: () => {},
    onPreviewFile: () => {},
    onRemoveFile: () => {},
  },
};
