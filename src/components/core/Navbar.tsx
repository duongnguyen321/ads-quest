'use client';

import { ThemeSwitch } from '@/components/SwitchTheme';
import { requireLevelRevert, requireTONCashout } from '@/configs/require.configs';
import { format } from '@/helpers/number.helpers';
import useUserStore from '@/store/user.store';
import { Button, Navbar as NextUINavbar, NavbarContent, NavbarItem } from '@nextui-org/react';
import type { User } from '@ts//user.types';
import { CoinsSwap, Home, MoneySquare, PlusSquare, ReceiveDollars } from 'iconoir-react/regular';
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
      className="print:hidden navbar"
      position="sticky"
      shouldHideOnScroll
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}>
      <NavbarContent
        justify="center">
        <NavbarItem>
          <Button as={Link}
                  href={'/'}
                  isIconOnly
                  variant={'flat'}
                  color={'primary'}>
            <Home />
          </Button>
        </NavbarItem>

        <NavbarItem className={'hidden md:block'}>
          Level: {user?.level || 1}
        </NavbarItem>

        <NavbarItem className={'hidden sm:block'}>
          Point: {format(user?.points)}
        </NavbarItem>

        <NavbarItem className={'hidden md:block'}>
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
    return (
      <NavbarItem>
      <Button
        as={Link}
        href={'/deposit'}
        color={'success'}
        variant={'shadow'}
      >
        <ReceiveDollars />
        <span>Deposit</span>
      </Button>
    </NavbarItem>
    );
  }
  return (
    <>
      <NavbarItem>
        <Button
          as={Link}
          href={'/missions'}
          color={'warning'}
          variant={'shadow'}
          isDisabled={!user || !user.walletAddress || !user.isUnlock}
          className={'px-2 min-w-10'}
        >
          <MoneySquare />
          <span className={'hidden vsm:block'}>Mission</span>
        </Button>
      </NavbarItem>
      <NavbarItem>
        <Button
          as={Link}
          href={'/deposit'}
          color={'success'}
          variant={'shadow'}
          className={'px-2 min-w-10'}
        >
          <PlusSquare />
          <span className={'hidden md:block'}>Add task</span>
        </Button>
      </NavbarItem>
      <NavbarItem>
        <Button
          as={Link}
          href={'/revert'}
          color={'primary'}
          variant={'shadow'}
          isDisabled={!user || !user.walletAddress || !user.isUnlock || user?.coinBalance < requireTONCashout || user.level < requireLevelRevert}
          className={'px-2 min-w-10'}
        >
          <CoinsSwap />
          <span className={'hidden md:block'}>Revert</span>
        </Button>
      </NavbarItem>
    </>
  );
}
