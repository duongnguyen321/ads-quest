'use client';

import { requireLevelRevert, requireTONCashout } from '@/configs/require.configs';
import { truncate } from '@/helpers/string.helpers';
import { useTelegram } from '@/hooks/useTelegram.hook';
import useTonAction from '@/hooks/useTonAction';
import useUserStore from '@/store/user.store';
import { CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Button, Card } from '@nextui-org/react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useCopyToClipboard } from '@uidotdev/usehooks';
import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

export default function Home() {
  const { wallet, rawAddress } = useTonAction();
  const { user: userTelegram } = useTelegram();
  const { user, refetch } = useUserStore();
  const [, copyText] = useCopyToClipboard();

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
    lastRefetch.current = Date.now();
    setCanRefetch(false); // Disable refetching until the time has elapsed
    const id = toast.loading('Refetching...');
    refetch(user?.telegramId).then(() => {
      toast.dismiss(id);
      toast.success('Refetch successfully.');
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
              {
                wallet ?
                  <CardBody className={'!text-teal-800 dark:!text-teal-200 text-center'}>
                    <span>Your TON Address: </span>
                    <strong className={'relative z-20'} onClick={async () => {
                      await copyText(rawAddress);
                      toast.info(
                        <>
                          <b>
                            {
                              truncate(rawAddress, {
                                limit: 5,
                              })
                            }
                          </b>
                          has copied to your clipboard!
                        </>);
                    }}>
                      {truncate(rawAddress, {
                        limit: 5,
                      })}
                    </strong>
                  </CardBody>
                  : <Button color={'primary'} variant={'ghost'}>Connect TON wallet</Button>
              }
              <TonConnectButton
                className={'absolute inset-0 !w-full !h-full opacity-0 z-10'}
              />
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
              {user.isUnlock ? (
                <Link href={'/missions'} className={'text-success'}>
                  Thank god!, you are unlock the missions! <br />
                  <i>
                    From now on, you can earn money from the mission
                    of sponsored brands
                  </i>
                </Link>
              ) : <Link href={'/deposit'} className={'text-warning'}>
                Oops, Please note, in order to be able to monetize sponsored brands, you need to send us a fee that
                proves you are human!
              </Link>
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
