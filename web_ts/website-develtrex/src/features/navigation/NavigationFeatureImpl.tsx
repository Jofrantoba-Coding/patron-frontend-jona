import { useEffect, useRef, useState } from 'react';
import type { InterNavigationFeature } from './InterNavigationFeature';
import { NavigationFeatureView, type InterNavigationFeatureView } from './NavigationFeatureView';

type DropdownMenu = InterNavigationFeatureView['activeDropdown'];

export function NavigationFeatureImpl(props: InterNavigationFeature) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<DropdownMenu>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setActiveDropdown(null);
        setIsMenuOpen(false);
      }
    }
    function handleClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setActiveDropdown(null);
      }
    }
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <NavigationFeatureView
      {...props}
      navRef={navRef}
      isMenuOpen={isMenuOpen}
      activeDropdown={activeDropdown}
      onToggleMenu={() => setIsMenuOpen((prev) => !prev)}
      onCloseMenu={() => setIsMenuOpen(false)}
      onDropdownEnter={(menu) => setActiveDropdown(menu)}
      onDropdownToggle={(menu) => setActiveDropdown((prev) => (prev === menu ? null : menu))}
      onCloseDropdown={() => setActiveDropdown(null)}
    />
  );
}
