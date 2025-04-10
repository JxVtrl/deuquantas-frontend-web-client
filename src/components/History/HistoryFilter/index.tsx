import React from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { Button } from '../../ui/button';
import Image from 'next/image';

export const HistoryFilter: React.FC = () => {
  return (
    <div>
      <Drawer>
        <DrawerTrigger className='bg-transparent cursor-pointer p-[8px] hover:bg-transparent'>
          <Image
            src='/icons/filter.svg'
            width={20}
            height={20}
            alt='Filter icon'
          />
        </DrawerTrigger>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle>Are you absolutely sure?</DrawerTitle>
            <DrawerDescription>This action cannot be undone.</DrawerDescription>
          </DrawerHeader>
          <DrawerFooter>
            <Button>Submit</Button>
            <DrawerClose>
              <Button variant='outline'>Cancel</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </div>
  );
};
