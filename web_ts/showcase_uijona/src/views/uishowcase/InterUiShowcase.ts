export interface InterUiShowcase {
  activeId: string;
  activeTab: 'preview' | 'code' | 'docs';
  code: string;
  isFullscreen: boolean;
  onSelectComponent: (id: string) => void;
  onTabChange: (tab: 'preview' | 'code' | 'docs') => void;
  onCodeChange: (code: string) => void;
  onToggleFullscreen: () => void;
}
