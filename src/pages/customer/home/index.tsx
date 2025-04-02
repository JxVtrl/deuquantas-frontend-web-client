import { withAuthCustomer } from '@/hoc/withAuth';
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { StatusBar } from '@/components/StatusBar';
import { Header } from '@/components/Header';
import { NavigationPills } from '@/components/NavigationPills';
import { ActionGrid } from '@/components/ActionGrid';
import { FavoritePlaces } from '@/components/FavoritePlaces';
import { BottomNavigation } from '@/components/BottomNavigation';
import { useNavigation } from '@/hooks/useNavigation';
// import HomeCard from '@/components/Home/HomeCard/index';

const CustomerHome: React.FC = () => {
  const { user } = useAuth();
  const firstName = user?.name?.split(' ')[0] || 'Usuário';
  const { navigationPills, actionItems, bottomNavItems, handleAddClick } =
    useNavigation();

  const favoritePlaces = [
    { id: '1', name: 'Bar do Gomez' },
    { id: '2', name: 'Braseiro' },
    { id: '3', name: 'Belmonte' },
    { id: '4', name: 'Quartinho' },
    { id: '5', name: 'Rio Tap' },
  ];

  return (
    <>
      <StatusBar />
      <Header firstName={firstName} />
      <NavigationPills pills={navigationPills} />
      <ActionGrid items={actionItems} />
      <FavoritePlaces places={favoritePlaces} />
      <BottomNavigation items={bottomNavItems} onAddClick={handleAddClick} />
    </>
  );
};

export default withAuthCustomer(CustomerHome);
