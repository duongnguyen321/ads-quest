'use server';

import { INIT_LEVELS } from '@/configs/init.configs';
import prisma from '@/lib/prisma.lib';

export async function initLevel(levels: typeof INIT_LEVELS) {
  try {
    console.info('Start init levels');
    await prisma.level.createMany({
      data: levels,
    });
    console.info('Create level');
  } catch (e) {
    console.error(e);
  }
}
