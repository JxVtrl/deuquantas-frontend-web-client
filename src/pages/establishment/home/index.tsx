import { withAuthEstablishment } from '@/hoc/withAuth';
import EstablishmentLayout from '@/layout/EstablishmentLayout';
import { NavigationPills } from '@/components/NavigationPills';
import { ActionGrid } from '@/components/ActionGrid';

const Home: React.FC = () => {
  return (
    <EstablishmentLayout>
      <NavigationPills />
      <ActionGrid />
    </EstablishmentLayout>
  );
};

export default withAuthEstablishment(Home);
