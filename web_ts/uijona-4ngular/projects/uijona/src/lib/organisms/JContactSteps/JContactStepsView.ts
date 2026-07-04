// JContactStepsView.ts — JONA View (template puro)
export const J_CONTACT_STEPS_TEMPLATE = `
    <section [class]="classes()">
      <div class="mx-auto w-full max-w-3xl px-4 sm:px-6">
        <j-section-heading [eyebrow]="eyebrow()" [heading]="heading()" className="mb-10" />
        <div class="flex flex-col gap-4">
          @for (step of steps(); track step.num) {
            <j-numbered-step [num]="step.num" [title]="step.title" [body]="step.body" />
          }
        </div>
      </div>
    </section>
  `;

