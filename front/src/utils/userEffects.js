import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const useCheckSession = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();
  const shouldSkipRequest = true; // Cambiar a 'false' si se quiere realizar la petición

  useEffect(() => {
    const checkSession = async () => {
      try {
        if (!shouldSkipRequest) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (response.ok) {
            const data = await response.json();
            setUser(data.user || null);
          } else if (response.status === 401) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error("error session:", error);
      }
    };

    checkSession();
  }, [router.pathname, shouldSkipRequest]);

  return user;
};

const useGetUserPreferences = (user) => {
  const [userPreferences, setUserPreferences] = useState({});
  const [userPreferencesLoaded, setUserPreferencesLoaded] = useState(false);

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        if (user) {
          // Si hay un usuario autenticado, obtenemos las preferencias desde MongoDB
          const { mainCategoryCounts, subCategoryCounts, thirdCategoryCounts } = user;

          setUserPreferences({
            mainCategoryCounts: mainCategoryCounts || {},
            subCategoryCounts: subCategoryCounts || {},
            thirdCategoryCounts: thirdCategoryCounts || {},
          });
          // Guardamos las preferencias del usuario en el almacenamiento local
          localStorage.setItem("mainCategoryPreferences", JSON.stringify(mainCategoryCounts));
          localStorage.setItem("subCategoryPreferences", JSON.stringify(subCategoryCounts));
          localStorage.setItem("thirdCategoryPreferences", JSON.stringify(thirdCategoryCounts));

          setUserPreferencesLoaded(true);
        } else if (!userPreferencesLoaded) {
          // Si no hay un usuario autenticado, obtenemos las preferencias desde el almacenamiento local
          const mainCategoryPreferences = JSON.parse(localStorage.getItem("mainCategoryPreferences")) || {};
          const subCategoryPreferences = JSON.parse(localStorage.getItem("subCategoryPreferences")) || {};
          const thirdCategoryPreferences = JSON.parse(localStorage.getItem("thirdCategoryPreferences")) || {};

          setUserPreferences({
            mainCategoryCounts: mainCategoryPreferences,
            subCategoryCounts: subCategoryPreferences,
            thirdCategoryCounts: thirdCategoryPreferences,
          });

          setUserPreferencesLoaded(true);
        }
      } catch (error) {
        console.error("Error al obtener las preferencias de usuario:", error);
      }
    };

    fetchUserPreferences();
  }, [user, userPreferencesLoaded]);

  return { userPreferences, userPreferencesLoaded };
};

export { useCheckSession, useGetUserPreferences };