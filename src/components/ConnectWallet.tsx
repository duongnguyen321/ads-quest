import { truncate } from '@/helpers/string.helpers';
import { cn } from '@/helpers/tailwind.helpers';
import useTonAction from '@/hooks/useTonAction';
import { CardBody } from '@nextui-org/card';
import { Button } from '@nextui-org/react';
import { TonConnectButton } from '@tonconnect/ui-react';
import { useCopyToClipboard } from '@uidotdev/usehooks';
import type { HTMLAttributes } from 'react';
import { toast } from 'sonner';

export type IConnectWalletProps = HTMLAttributes<HTMLDivElement>

function ConnectWallet({className}: IConnectWalletProps) {
  const { wallet, rawAddress } = useTonAction();
  const [, copyText] = useCopyToClipboard();
  return (
   <div className={cn('relative', className)}>
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
   </div>
  );
}

export default ConnectWallet;
