export interface InterEventsDialogMolecule {
    onClose?: () => void;
    onOpened?: () => void;
    onClosed?: () => void;
    onConfirm?: () => void;
    onCancel?: () => void;
}
