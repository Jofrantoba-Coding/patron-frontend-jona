export interface ErrorMessageAtomProps {
  message?: string;
}

export function ErrorMessageAtom({ message }: ErrorMessageAtomProps) {
  if (!message) {
    return null;
  }

  return <p className="error-message-atom">{message}</p>;
}
