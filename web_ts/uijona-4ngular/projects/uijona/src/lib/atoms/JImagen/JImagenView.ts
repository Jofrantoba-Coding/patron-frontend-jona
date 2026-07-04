// JImagenView.ts — JONA View (template puro)
export const J_IMAGEN_TEMPLATE = `
    <img
      [src]="currentSrc()"
      [alt]="alt()"
      [attr.loading]="loading()"
      [attr.decoding]="decoding()"
      [attr.data-jimagen-fit]="fit()"
      [attr.data-jimagen-radius]="radius()"
      [attr.data-jimagen-aspect]="aspectRatio() !== 'auto' ? aspectRatio() : null"
      [attr.data-jimagen-block]="block() ? 'true' : null"
      [class]="classes()"
      [style]="style()"
      (error)="onError()"
    />
  `;
