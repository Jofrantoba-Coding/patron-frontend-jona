export interface InterEventsDropdownMolecule {
  onOpen?: () => void;
  onClose?: () => void;
  onItemSelect?: (label: string) => void;
  onDisabledItemClick?: (label: string) => void;
}
