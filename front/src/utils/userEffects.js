import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const useCheckSession = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const checkSession = async () => {
      try {
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
          console.log("no logged");
        }
      } catch (error) {
        console.error("error session:", error);
      }
    };

    checkSession();
  }, [router.pathname]);

  return user;
};

const useGetUserPreferences = (user) => {
  const [userPreferences, setUserPreferences] = useState({});
  const [userPreferencesLoaded, setUserPreferencesLoaded] = useState(false);

  useEffect(() => {
    const fetchUserPreferences = async () => {
      try {
        if (user) {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user/preferences`,
            {
              credentials: "include",
            }
          );
          const data = await response.json();
          setUserPreferences(data);
          setUserPreferencesLoaded(true);
          console.log("Datos enviados con el usuario");
        } else {
          const mainCategoryPreferences =
            JSON.parse(localStorage.getItem("mainCategoryPreferences")) || {};
          const subCategoryPreferences =
            JSON.parse(localStorage.getItem("subCategoryPreferences")) || {};
          const thirdCategoryPreferences =
            JSON.parse(localStorage.getItem("thirdCategoryPreferences")) || {};

          setUserPreferences({
            mainCategoryCounts: mainCategoryPreferences || {},
            subCategoryCounts: subCategoryPreferences || {},
            thirdCategoryCounts: thirdCategoryPreferences || {},
          });
          setUserPreferencesLoaded(true);
          console.log("Datos enviados con el localStorage");
        }
      } catch (error) {
        console.error("Error al obtener las preferencias de usuario:", error);
      }
    };

    fetchUserPreferences();
  }, [user]);

  return { userPreferences, userPreferencesLoaded };
};

export { useCheckSession, useGetUserPreferences };