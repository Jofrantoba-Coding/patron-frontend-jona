import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';
import { useState } from 'react';
import { JFileUpload, JFILE_UPLOAD_DEFAULTS } from './JFileUpload';
import { JPanel } from '../../atoms/JPanel/JPanel';
import { JLabel } from '../../atoms/JLabel';

const meta: Meta<typeof JFileUpload> = {
  title: 'Molecules/JFileUpload',
  component: JFileUpload,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'JFileUpload es el componente de carga de archivos de JONA. Soporta arrastrar y soltar (drag & drop), selección múltiple, filtros por tipo de archivo (`accept`), límite de archivos (`maxFiles`) y modo controlado/no controlado. Los archivos rechazados se notifican vía `onReject`. Reemplaza a `JFileUpload`.',
      },
    },
  },
  args: {
    label:         'Upload documents',
    description:   'PDF, PNG or JPG up to your application limit.',
    accept:        '.pdf,image/*',
    multiple:      true,
    maxFiles:      3,
    onFilesChange: fn(),
    onReject:      fn(),
  },
  argTypes: {
    label: {
      description: 'Texto principal de la zona de arrastre. Se usa también como `aria-label` del input.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: JFILE_UPLOAD_DEFAULTS.label },
      },
    },
    description: {
      description: 'Subtexto descriptivo bajo el título. Indica los tipos o límites de tamaño aceptados.',
      control: 'text',
      table: {
        type: { summary: 'string' },
        defaultValue: { summary: JFILE_UPLOAD_DEFAULTS.description },
      },
    },
    helperText: {
      description: 'Texto de ayuda debajo de la zona de arrastre. Útil para indicar estado tras la selección.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    accept: {
      description: 'Tipos de archivo aceptados en formato `input[accept]`. Ej: `".pdf,image/*"`. Los archivos que no coincidan disparan `onReject` con `reason="accept"`.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    multiple: {
      description: 'Permite seleccionar más de un archivo a la vez.',
      control: 'boolean',
      table: {
        type: { summary: 'boolean' },
        defaultValue: { summary: String(JFILE_UPLOAD_DEFAULTS.multiple) },
      },
    },
    maxFiles: {
      description: 'Número máximo de archivos admitidos. Los excedentes disparan `onReject` con `reason="max-files"`.',
      control: { type: 'number', min: 1 },
      table: { type: { summary: 'number' } },
    },
    files: {
      description: 'Lista controlada de archivos. Combinar con `onFilesChange` para modo controlado.',
      table: { type: { summary: 'File[]' } },
    },
    defaultFiles: {
      description: 'Lista inicial en modo no controlado.',
      table: { type: { summary: 'File[]' } },
    },
    onFilesChange: {
      description: 'Callback al cambiar la lista de archivos (tras añadir o eliminar). Recibe la lista completa actualizada.',
      table: { type: { summary: '(files: File[]) => void' } },
    },
    onReject: {
      description: 'Callback cuando se rechazan archivos. `reason="accept"` si el tipo no coincide; `reason="max-files"` si se supera el límite.',
      table: { type: { summary: '(reject: JFileUploadReject) => void' } },
    },
    onRemoveFile: {
      description: 'Callback adicional al eliminar un archivo individual. Recibe el archivo eliminado y la lista resultante.',
      table: { type: { summary: '(file: File, nextFiles: File[]) => void' } },
    },
    disabled: {
      description: 'Desactiva el input y la zona de arrastre.',
      control: 'boolean',
      table: { type: { summary: 'boolean' } },
    },
    dropzoneClassName: {
      description: 'Clase CSS adicional para la zona de arrastre.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
    fileListClassName: {
      description: 'Clase CSS adicional para la lista de archivos seleccionados.',
      control: 'text',
      table: { type: { summary: 'string' } },
    },
  },
};
export default meta;
type Story = StoryObj<typeof JFileUpload>;

// ── Stories ───────────────────────────────────────────────────────────────────

export const Default: Story = {
  parameters: {
    docs: {
      description: { story: 'Playground interactivo. Acepta PDF e imágenes hasta 3 archivos. Arrastra archivos o haz clic para abrir el selector.' },
    },
  },
};

export const SingleFile: Story = {
  name: 'Archivo único',
  args: {
    multiple:    false,
    maxFiles:    undefined,
    label:       'Subir foto de perfil',
    description: 'JPG o PNG. Solo un archivo.',
    accept:      'image/*',
  },
  parameters: {
    docs: {
      description: { story: '`multiple=false` limita a un solo archivo. Al seleccionar uno nuevo reemplaza al anterior.' },
    },
  },
};

export const WithHelper: Story = {
  name: 'Con texto de ayuda',
  args: {
    helperText: 'Los archivos seleccionados se envían junto con el formulario al pulsar Guardar.',
  },
  parameters: {
    docs: {
      description: { story: '`helperText` aparece debajo de la zona de arrastre. Útil para indicar el momento de envío o restricciones de tamaño.' },
    },
  },
};

export const Disabled: Story = {
  args: {
    disabled:    true,
    label:       'Carga deshabilitada',
    description: 'No es posible adjuntar archivos en este momento.',
  },
  parameters: {
    docs: {
      description: { story: '`disabled=true` desactiva el input y aplica opacidad a la zona de arrastre.' },
    },
  },
};

export const Interactive: Story = {
  parameters: {
    docs: {
      description: { story: 'Modo controlado: el padre mantiene la lista de archivos en su estado. El `helperText` se actualiza en tiempo real con el conteo de archivos seleccionados.' },
    },
  },
  args: { onFilesChange: fn(), onReject: fn() },
  render: (args) => {
    const [files, setFiles] = useState<File[]>([]);
    return (
      <JPanel variant="ghost" padding="none" className="flex flex-col gap-3 w-96">
        <JFileUpload
          label="Adjuntar documentos"
          description="PDF, PNG o JPG hasta 5 MB"
          accept=".pdf,image/*"
          multiple
          maxFiles={3}
          onFilesChange={(f) => { args.onFilesChange?.(f); setFiles(f); }}
          onReject={args.onReject}
          helperText={
            files.length > 0
              ? `${files.length} archivo(s) seleccionado(s). Listos para enviar.`
              : undefined
          }
        />
        {files.length > 0 && (
          <ul className="flex flex-col gap-1 list-disc list-inside">
            {files.map((f) => (
              <li key={f.name}>
                <JLabel size="xs" color="muted">{f.name} ({(f.size / 1024).toFixed(1)} KB)</JLabel>
              </li>
            ))}
          </ul>
        )}
      </JPanel>
    );
  },
};
