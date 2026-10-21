import type { SidebarNavItem } from 'uijona-4ngular';
import { ShellViewComponent } from './shell-view.component';

class ShellHarness extends ShellViewComponent {
  selected: string | null = null;

  openMenu(): void {
    this.toggleMobile();
  }
  closeWithEscape(): void {
    this.closeMobile();
  }
  select(item: SidebarNavItem): void {
    this.onNavSelected(item);
  }
  isMenuOpen(): boolean {
    return this.mobileOpen();
  }
  protected override onNav(item: SidebarNavItem): void {
    this.selected = item.key;
  }
}

describe('ShellViewComponent mobile navigation', () => {
  it('cierra el menu movil despues de navegar', () => {
    const shell = new ShellHarness();
    shell.openMenu();

    shell.select({ key: 'planillas', label: 'Planillas' });

    expect(shell.selected).toBe('planillas');
    expect(shell.isMenuOpen()).toBe(false);
  });

  it('cierra el menu movil al recibir Escape', () => {
    const shell = new ShellHarness();
    shell.openMenu();

    shell.closeWithEscape();

    expect(shell.isMenuOpen()).toBe(false);
  });
});
