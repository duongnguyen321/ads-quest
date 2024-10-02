'use client';

import ConnectWallet from '@/components/ConnectWallet';
import { requireLevelRevert, requireTONCashout } from '@/configs/require.configs';
import { useTelegram } from '@/hooks/useTelegram.hook';
import useUserStore from '@/store/user.store';
import { CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Button, Card } from '@nextui-org/react';
import { MoneySquare, ReceiveDollars } from 'iconoir-react/regular';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';

export default function Home() {
  const { user: userTelegram } = useTelegram();
  const { user, refetch } = useUserStore();


  const lastRefetch = useRef(Date.now());
  const [canRefetch, setCanRefetch] = useState(false);

  useEffect(() => {
    const checkRefetch = () => {
      const timeSinceLastRefetch = Date.now() - lastRefetch.current;
      setCanRefetch(timeSinceLastRefetch >= 10000); // 10 seconds
    };

    const interval = setInterval(checkRefetch, 1000); // Check every second
    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  const handleRefetch = useCallback(() => {
    if (!canRefetch) return;
    refetch(user?.telegramId).then(() => {
      lastRefetch.current = Date.now();
      setCanRefetch(false);
    });
  }, [canRefetch, refetch, user?.telegramId]);

  return (
    <Card className="w-full h-full mt-4 p-4">
      <CardHeader className="dark:text-teal-300 text-teal-600">
        <h1 className="text-2xl text-center w-full font-medium">
          Welcome - {user?.username || userTelegram?.username || 'User'}
        </h1>
      </CardHeader>
      {user ? (
        <CardBody className="items-center justify-center gap-3">
          <Card className={'relative flex items-center justify-center gap-3'}>
            <CardHeader className={'relative w-fit h-fit'}>
              <ConnectWallet />
            </CardHeader>
            <CardBody className={'!text-teal-900 dark:!text-teal-100'}>
              <p>
                You are at level <b>{user.level}</b>,
                after <b>{requireLevelRevert - user.level}</b> more levels, you
                can change from
                points to TON.
              </p>
              <i>
                After level <b>{requireLevelRevert}</b>, you can convert your point to TON, and
                after <b>{requireTONCashout}</b> TON, you can cashout to your wallet!
              </i>
            </CardBody>
            <CardFooter>
              {user.walletAddress && user.isUnlock ? (
                <div className={'flex flex-col items-center gap-4'}>
                  <Link href={'/missions'} className={'text-success'}>
                    Thank you!, you are unlock the missions! <br />
                    <i>
                      From now on, you can earn money from the mission
                      of sponsored brands
                    </i>
                  </Link>
                  <Button as={Link}
                          href={'/missions'}
                          variant={'flat'}
                          color={'success'}>
                    <MoneySquare />
                    Do mission now
                  </Button>
                </div>
              ) : <div className={'flex flex-col items-center gap-4'}>
                <Link href={'/deposit'} className={'text-warning'}>
                  Oops, Please note, in order to be able to monetize sponsored brands, you need to send us a fee that
                  proves you are human!
                </Link>
                {user.walletAddress && (
                  <Button as={Link}
                          href={'/deposit'}
                          variant={'flat'}
                          color={'success'}>
                    <ReceiveDollars />
                    Unlock now
                  </Button>
                )}
              </div>
              }
            </CardFooter>
          </Card>
          <Button disabled={!canRefetch} color={canRefetch ? 'success' : 'secondary'} variant="ghost"
                  onClick={handleRefetch}>
            {canRefetch ? 'Refetch' : 'Waiting for refetch'}
          </Button>
        </CardBody>
      ) : <p>Waiting for loading your data...</p>}
    </Card>
  );
}
