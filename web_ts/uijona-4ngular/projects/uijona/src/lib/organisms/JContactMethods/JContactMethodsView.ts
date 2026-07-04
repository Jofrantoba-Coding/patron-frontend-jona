// JContactMethodsView.ts — JONA View (template puro)
export const J_CONTACT_METHODS_TEMPLATE = `
    <section [class]="cn('w-full bg-white py-16 sm:py-20', className())">
      <div class="mx-auto w-full max-w-6xl px-4 sm:px-6">
        <div class="grid gap-5 [grid-template-columns:repeat(auto-fit,minmax(min(100%,260px),1fr))]">
          @for (m of methods(); track m.label) {
            <j-contact-method-card
              [icon]="m.icon"
              [label]="m.label"
              [description]="m.description"
              [href]="m.href"
              [actionLabel]="m.actionLabel"
              [isPrimary]="!!m.isPrimary"
            />
          }
        </div>
      </div>
    </section>
  `;

