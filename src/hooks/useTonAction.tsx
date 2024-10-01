import { siteConfig } from '@/configs/site.configs';
import { addAddressUser, removeAddressUser, unlockUser } from '@/services/user.services';
import useUserStore from '@/store/user.store';
import { Address, beginCell, Cell, toNano } from '@ton/ton';
import type { ConnectedWallet, Wallet } from '@tonconnect/ui';
import { useTonAddress, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useCallback, useLayoutEffect, useState } from 'react';
import { toast } from 'sonner';
import TonWeb from 'tonweb';
import type { AddressType } from 'tonweb/dist/types/utils/address';

const { Address: AddressTONWeb } = TonWeb;

export default function useTonAction() {
  const [loading, setLoading] = useState(false);

  const { userId, setUserInfo } = useUserStore();

  const rawAddress = useTonAddress();
  const [tonConnectUi] = useTonConnectUI();
  const wallet: (Wallet & { appName?: string }) | null = useTonWallet();

  function convertAddress(rawAddress: AddressType) {
    try {
      return new AddressTONWeb(rawAddress).toString(true, true);
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


  async function deposit({
                           message,
                           amount,
                         }: {
    message: string;
    amount: number;
  }) {
    if (!wallet) {
      toast.error('Please, Connect Ton Wallet!');
      throw new Error('Please, Connect Ton Wallet!');
    }
    const body = beginCell()
      .storeUint(0, 32)
      .storeStringTail(message || `Hello, ${siteConfig.name}!`) // nội dung
      .endCell();

    const mainAddress = process.env.TON_ADDRESS as string; //lấy địa chỉ người nhận

    const payload = {
      addressReceiver: mainAddress, //địa chỉ người nhận
      addressSend: rawAddress, //địa chỉ người gửi

      payload: body.toBoc().toString('base64'),
      amount: toNano(amount), // price of item
      userAddress: rawAddress, //địa chỉ người gửi
    };

    if (wallet?.appName === 'tonkeeper') {
      payload.addressReceiver = Address.parse(payload.addressReceiver).toRawString();
    }

    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 1200,
      messages: [
        {
          address: payload.addressReceiver,
          amount: payload.amount.toString(),
          payload: payload.payload,
        },
      ],
    };
    const response = await tonConnectUi.sendTransaction(transaction);
    try {
      const bocBuffer = Buffer.from(response.boc, 'base64');
      const cell = Cell.fromBoc(bocBuffer)[0];
      const messageHash = cell.hash();
      const base64Hash = Buffer.from(messageHash).toString('base64');
      await unlockUser(userId, base64Hash);
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  return {
    loading,
    wallet,
    deposit,
    rawAddress,
    tonConnectUi,
  };
}
