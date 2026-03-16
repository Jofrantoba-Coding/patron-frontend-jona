export interface InterUiShowcase {
  activeId: string;
  activeTab: 'preview' | 'code' | 'docs';
  code: string;
  onSelectComponent: (id: string) => void;
  onTabChange: (tab: 'preview' | 'code' | 'docs') => void;
  onCodeChange: (code: string) => void;
}
