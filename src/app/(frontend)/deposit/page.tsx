'use client';

import AddMission from '@/app/(frontend)/deposit/components/AddMission';
import ConnectWallet from '@/components/ConnectWallet';
import { INIT_AMOUNT_UNLOCK } from '@/configs/ton.configs';
import useGlobalContext from '@/hooks/useGlobalContext.hook';
import useTonAction from '@/hooks/useTonAction';
import useUserStore from '@/store/user.store';
import { CardBody, CardFooter, CardHeader } from '@nextui-org/card';
import { Button, Card } from '@nextui-org/react';
import { ReceiveDollars } from 'iconoir-react/regular';
import { useState } from 'react';
import { toast } from 'sonner';

function DepositPage() {
  const { deposit } = useTonAction();
  const { setIsCongrats } = useGlobalContext();
  const { user, setUserInfo } = useUserStore();
  const [loading, setLoading] = useState(false);


  async function handleUnlockUser() {
    if (loading || !user) return;
    setLoading(true);
    const toastId = toast.loading('Unlocking user...');
    try {
      const userUpdated = await deposit(INIT_AMOUNT_UNLOCK, `Unlock user ${user?.username}`);
      setUserInfo(userUpdated);
      toast.success('User unlock successfully.');
      setIsCongrats(true);
      setTimeout(() => setIsCongrats(false), 3000);
    } catch (e) {
      console.error(e);
      toast.error('Error when unlock user.');
    } finally {
      setLoading(false);
      toast.dismiss(toastId);
    }
  }

  return (
    <Card>
      <CardHeader className={'!text-teal-800 dark:!text-teal-200 text-center'}>
        <h1 className={'w-full font-semibold'}>Deposit - {user?.username}</h1>
      </CardHeader>
      <CardBody className={'!text-teal-800 dark:!text-teal-200 text-center'}>
        {
          user?.isUnlock ? (
            <AddMission />
          ) : <>
            <span>You haven&apos;t unlocked your account yet, unlock it!</span>
          </>
        }
      </CardBody>
      <CardFooter className={'flex-col justify-center items-center'}>
        <ConnectWallet />
        {!user?.isUnlock && (
          <Button
            onClick={handleUnlockUser}
            variant={'shadow'}
            color={'success'}
          >
            <ReceiveDollars />
            Unlock now
          </Button>
        )}
      </CardFooter>
    </Card>
  );
}

export default DepositPage;
