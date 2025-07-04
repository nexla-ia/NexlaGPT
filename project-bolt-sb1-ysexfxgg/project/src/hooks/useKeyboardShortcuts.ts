import { useEffect } from 'react';

interface ShortcutConfig {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: ShortcutConfig[], enabled: boolean = true) {
  useEffect(() => {
    if (!enabled) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      const matchingShortcut = shortcuts.find(shortcut => {
        const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase();
        const ctrlMatch = !!shortcut.ctrlKey === event.ctrlKey;
        const metaMatch = !!shortcut.metaKey === event.metaKey;
        const shiftMatch = !!shortcut.shiftKey === event.shiftKey;
        const altMatch = !!shortcut.altKey === event.altKey;

        return keyMatch && ctrlMatch && metaMatch && shiftMatch && altMatch;
      });

      if (matchingShortcut) {
        event.preventDefault();
        matchingShortcut.action();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, enabled]);
}

export function useProfileMenuShortcuts() {
  const shortcuts: ShortcutConfig[] = [
    {
      key: 'p',
      action: () => window.dispatchEvent(new CustomEvent('navigate-to-profile')),
      description: 'Abrir perfil'
    },
    {
      key: 's',
      action: () => window.dispatchEvent(new CustomEvent('navigate-to-settings')),
      description: 'Abrir configurações'
    },
    {
      key: 'h',
      action: () => window.dispatchEvent(new CustomEvent('navigate-to-activity')),
      description: 'Abrir histórico'
    },
    {
      key: 'b',
      action: () => window.dispatchEvent(new CustomEvent('navigate-to-billing')),
      description: 'Abrir cobrança'
    },
    {
      key: '?',
      action: () => window.dispatchEvent(new CustomEvent('navigate-to-help')),
      description: 'Abrir ajuda'
    },
    {
      key: 'q',
      metaKey: true,
      action: () => {
        if (confirm('Tem certeza que deseja sair?')) {
          window.dispatchEvent(new CustomEvent('logout'));
        }
      },
      description: 'Sair da conta'
    }
  ];

  useKeyboardShortcuts(shortcuts);
}