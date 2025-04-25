import { ActionRounded, MaxWidthWrapper, Title } from '@deuquantas/components';

interface Place {
  id: string;
  name: string;
  icon?: React.ReactNode;
}

export const FavoritePlaces = () => {
  const places: Place[] = [
    { id: '1', name: 'Bar do Gomez' },
    { id: '2', name: 'Braseiro' },
    { id: '3', name: 'Belmonte' },
    { id: '4', name: 'Quartinho' },
    { id: '5', name: 'Rio Tap' },
  ];

  return (
    <>
      <MaxWidthWrapper backgroundColor="transparent" style={{}} styleContent={{}}>
        <Title title='Locais favoritos' />
      </MaxWidthWrapper>
      <ActionRounded places={places} />
    </>
  );
};
