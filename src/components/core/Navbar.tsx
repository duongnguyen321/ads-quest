'use client';

import { ThemeSwitch } from '@/components/core/SwitchTheme';
import { requireLevelRevert, requireTONCashout } from '@/configs/require.configs';
import { format } from '@/helpers/number.helpers';
import { upperFirstLetter } from '@/helpers/string.helpers';
import useUserStore from '@/store/user.store';
import { Button, Navbar as NextUINavbar, NavbarContent, NavbarItem } from '@nextui-org/react';
import type { User } from '@ts//user.types';
import { CoinsSwap, MoneySquare, ReceiveDollars } from 'iconoir-react/regular';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function Navbar() {
  const pathname = usePathname();
  const { user } = useUserStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [pathname]);

  return (
    <NextUINavbar
      as={`header`}
      maxWidth="xl"
      className="print:hidden"
      position="sticky"
      shouldHideOnScroll
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent
        justify="center">
        <NavbarItem className={'hidden sm:block'} as={'a'} href={`https://t.me/${user?.username}`}>
          {upperFirstLetter(user?.username)}
        </NavbarItem>

        <NavbarItem className={'hidden vsm:block'}>
          Level: {user?.level || 1}
        </NavbarItem>

        <NavbarItem>
          Point: {format(user?.points)}
        </NavbarItem>

        <NavbarItem>
          Coin: {format(user?.coinBalance)}
        </NavbarItem>
      </NavbarContent>

      <NavbarContent
        justify="center">
        <NaviLinkUser user={user} />
        <NavbarItem>
          <Button isIconOnly>
            <ThemeSwitch />
          </Button>
        </NavbarItem>
      </NavbarContent>
    </NextUINavbar>
  );
}

function NaviLinkUser({ user }: { user: User | null }) {
  if (!user) return null;
  if (!user?.isUnlock) {
    return (<NavbarItem>
      <Button
        as={Link}
        href={'/deposit'}
        color={'success'}
        variant={'shadow'}
      >
        <ReceiveDollars />
        <span>Deposit</span>
      </Button>
    </NavbarItem>);
  }
  return (
    <>
      <NavbarItem>
        <Button
          as={Link}
          href={'/missions'}
          color={'warning'}
          variant={'shadow'}
          isDisabled={!user || !user.isUnlock}
        >
          <MoneySquare />
          <span>Mission</span>
        </Button>
      </NavbarItem>
      <NavbarItem>
        <Button
          as={Link}
          href={'/revert'}
          color={'primary'}
          variant={'shadow'}
          isDisabled={!user || !user.isUnlock || user?.coinBalance < requireTONCashout || user.level < requireLevelRevert}
        >
          <CoinsSwap />
          <span>Revert</span>
        </Button>
      </NavbarItem>
    </>
  );
}
