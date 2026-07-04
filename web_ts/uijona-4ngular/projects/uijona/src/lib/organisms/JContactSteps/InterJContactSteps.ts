export interface ContactStepData {
  num: string;
  title: string;
  body: string;
}

/** Contrato publico de JContactSteps. */
export interface InterJContactSteps {
  eyebrow?: string;
  heading: string;
  steps: ContactStepData[];
}
