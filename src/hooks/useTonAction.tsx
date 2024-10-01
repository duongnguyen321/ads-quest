import { addAddressUser, removeAddressUser } from '@/services/user.services';
import useUserStore from '@/store/user.store';
import type { ConnectedWallet } from '@tonconnect/ui';
import { useTonAddress, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useCallback, useLayoutEffect, useState } from 'react';
import { toast } from 'sonner';
import TonWeb from 'tonweb';
import type { AddressType } from 'tonweb/dist/types/utils/address';

const { Address } = TonWeb;

export default function useTonAction() {
  const [loading, setLoading] = useState(false);

  const { userId, setUserInfo } = useUserStore();

  const rawAddress = useTonAddress();
  const [tonConnectUi] = useTonConnectUI();
  const wallet = useTonWallet();

  function convertAddress(rawAddress: AddressType) {
    try {
      return new Address(rawAddress).toString(true, true);
    } catch (error) {
      console.error('Error converting raw address:', error);
    }
  }

  const handleStatusChange = useCallback(
    async (w: ConnectedWallet | null) => {
      if (!w) {
        console.error('Not found wallet connection...');
        await removeAddressUser(userId).then(setUserInfo);
        return;
      }
      if (loading) return;
      try {
        setLoading(true);
        const addressFriendly = convertAddress(w?.account?.address);
        if (
          addressFriendly &&
          userId &&
          w
        ) {
          await addAddressUser(userId, addressFriendly).then(setUserInfo);
        }
      } catch (error) {
        console.error(error);
        console.error('Oops, error, disconnect now');
        await tonConnectUi.disconnect();
        await removeAddressUser(userId).then(setUserInfo);
        if (typeof error === 'string') toast.error(error);
        throw error;
      } finally {
        setLoading(false);
      }
    },
    [loading, setUserInfo, tonConnectUi, userId],
  );

  useLayoutEffect(() => {
    tonConnectUi.onStatusChange(handleStatusChange);
  }, [handleStatusChange, tonConnectUi]);

  return {
    loading,
    wallet,
    rawAddress,
    tonConnectUi,
  };
}
