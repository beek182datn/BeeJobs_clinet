import { useRouter } from "expo-router";
import { BackHandler } from "react-native";
import { useEffect, useState } from "react";
import AlertComponent from "./AlertComponent";

export const useBackHandler = (shouldExitApp: boolean = false) => {
  const router = useRouter();
  const [backPressedCount, setBackPressedCount] = useState(0);
  const [showAlert, setShowAlert] = useState(false);
  const [message, setMessage] = useState("");
  const [color, setColor] = useState("");
  const [backPressedTimer, setBackPressedTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        if (backPressedCount === 0) {
          setBackPressedCount(1);
          setBackPressedTimer(
            setTimeout(() => {
              setBackPressedCount(0);
            }, 2000)
          );
          setMessage("Ấn một lần nữa trong 2s để thoát ứng dụng");
          setColor("blue");
          setShowAlert(true);
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
      }
    );

    return () => backHandler.remove();
  }, [backPressedCount, router, backPressedTimer, shouldExitApp]);

  return { backPressedCount, setBackPressedCount, showAlert, setShowAlert, message, setMessage, color, setColor };
};
