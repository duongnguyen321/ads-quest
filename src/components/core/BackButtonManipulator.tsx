import { useBackButton } from '@tma.js/sdk-react';
import { usePathname, useRouter } from 'next/navigation';
import { type FC, useEffect } from 'react';

const BackButtonManipulator: FC = () => {
  const pathname = usePathname();
  const { back } = useRouter();
  const bb = useBackButton(true);

  useEffect(() => {
    if (!bb) {
      return;
    }
    if (pathname === '/') {
      bb.hide();
    } else {
      bb.show();
    }
  }, [pathname, bb]);

  useEffect(() => {
    return bb && bb.on('click', back);
  }, [bb, back]);

  return null;
};

export default BackButtonManipulator
