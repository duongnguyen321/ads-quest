'use client';

import useGlobalContext from '@/hooks/useGlobalContext.hook';
import { AnimatePresence, motion } from 'framer-motion';
import React, { memo } from 'react';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';


function Congrats() {
  const {isCongrats} = useGlobalContext()
  const { width, height } = useWindowSize();
  const confettiVariants = {
    initial: { opacity: 1 },
    animate: { opacity: 1 },
    exit: {
      opacity: 0,
      transition: { duration: 2 },
    },
  };
  return (
    <AnimatePresence>
      {isCongrats && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={confettiVariants}
          style={{ position: 'fixed', top: 0, left: 0, zIndex: 9999 }}
        >
          <Confetti width={width} height={height} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default memo(Congrats);
