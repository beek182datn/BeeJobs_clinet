import { useRouter } from 'expo-router';
import { BackHandler } from 'react-native';
import { useEffect, useState } from 'react';

export const useBackHandler = (shouldExitApp: boolean = false) => {
  const router = useRouter();
  const [backPressedCount, setBackPressedCount] = useState(0);
  const [backPressedTimer, setBackPressedTimer] = useState<
    ReturnType<typeof setTimeout> | null
  >(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      if (backPressedCount === 0) {
        setBackPressedCount(1);
        setBackPressedTimer(
          setTimeout(() => {
            setBackPressedCount(0);
          }, 2000)
        );
        console.log('Ấn một lần nữa trong 2s để quay về');
        return true; // Không cho back
      } else if (backPressedCount === 1) {
        if (backPressedTimer) {
          clearTimeout(backPressedTimer);
        }
        if (shouldExitApp) {
          BackHandler.exitApp();
        } else {
          router.back();
        }
        return true; // Cho phép back
      }
      return false; // Không xử lý sự kiện back
    });

    return () => backHandler.remove();
  }, [backPressedCount, router, backPressedTimer, shouldExitApp]);

  return [backPressedCount, setBackPressedCount] as const;
};