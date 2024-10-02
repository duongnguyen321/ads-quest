'use client';

import { SwitchProps, useSwitch } from '@nextui-org/react';
import { MoonFilledIcon, SunFilledIcon } from '@nextui-org/shared-icons';
import { useIsSSR } from '@react-aria/ssr';
import { VisuallyHidden } from '@react-aria/visually-hidden';
import clsx from 'clsx';
import { useTheme } from 'next-themes';
import { FC } from 'react';

export interface ThemeSwitchProps {
  className?: string;
  classNames?: SwitchProps['classNames'];
}

export const ThemeSwitch: FC<ThemeSwitchProps> = ({
                                                    className,
                                                    classNames,
                                                  }) => {
  const { theme, setTheme } = useTheme();
  const isSSR = useIsSSR();

  const onChange = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    theme === 'light' ? setTheme('dark') : setTheme('light');
  };

  const {
    Component,
    slots,
    isSelected,
    getBaseProps,
    getInputProps,
    getWrapperProps,
  } = useSwitch({
    isSelected: theme === 'light' || isSSR,
    'aria-label': `Switch to ${
      theme === 'light' || isSSR ? 'dark' : 'light'
    } mode`,
    onChange,
  });

  return (
    <Component
      {...getBaseProps({
        className: clsx(
          'px-px transition-opacity hover:opacity-80 cursor-pointer p-2',
          className,
          classNames?.base,
        ),
      })}>
      <VisuallyHidden>
        <input {...getInputProps()} />
      </VisuallyHidden>
      <div
        {...getWrapperProps()}
        className={slots.wrapper({
          class: clsx(
            [
              'w-auto h-auto',
              'bg-transparent',
              'rounded-lg',
              'flex items-center justify-center',
              'group-data-[selected=true]:bg-transparent',
              '!text-default-500',
              'pt-px',
              'px-0',
              'mx-0',
            ],
            classNames?.wrapper,
          ),
        })}>
        {!isSelected || isSSR ? (
          <SunFilledIcon />
        ) : (
          <MoonFilledIcon />
        )}
      </div>
    </Component>
  );
};
