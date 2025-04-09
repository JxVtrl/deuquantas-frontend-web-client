import Lottie from 'lottie-react';
import React from 'react';
import loadingAnimation from '../../../public/lotties/loading.json';

const LoadingLottie: React.FC = () => {
  return (
    <div className='flex flex-col items-center justify-center gap-4'>
      <Lottie
        animationData={loadingAnimation}
        loop={true}
        style={{ width: 200, height: 200 }}
      />
    </div>
  );
};

export default LoadingLottie;
