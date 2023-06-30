import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import PostsList from "@/components/posts/PostsList";

const IndexPage = () => {
  const router = useRouter();
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleRouteChange = () => {
      // Guardar la posición de desplazamiento actual antes de cambiar de página
      sessionStorage.setItem("scrollPosition", window.scrollY.toString());
    };

    const handlePopState = () => {
      // Restaurar la posición de desplazamiento al retroceder en el historial de navegación
      const savedScrollPosition = parseInt(sessionStorage.getItem("scrollPosition"), 10);
      if (!isNaN(savedScrollPosition)) {
        setScrollPosition(savedScrollPosition);
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);
    window.addEventListener("popstate", handlePopState);

    // Restaurar la posición de desplazamiento al cargar la página
    const savedScrollPosition = parseInt(sessionStorage.getItem("scrollPosition"), 10);
    if (!isNaN(savedScrollPosition)) {
      setScrollPosition(savedScrollPosition);
    }

    // Restaurar scroll instantáneamente sin animación
    document.documentElement.style.scrollBehavior = "auto";
    window.scrollTo(0, scrollPosition);

    // Restaurar el comportamiento de desplazamiento suave después de 50ms
    setTimeout(() => {
      document.documentElement.style.scrollBehavior = "smooth";
    }, 50);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [router.events]);

  useEffect(() => {
    // Desplazarse a la posición guardada al cargar la página o cambiar la posición de desplazamiento
    window.scrollTo(0, scrollPosition);
  }, [scrollPosition]);

  return (
    <div>
      <PostsList />
    </div>
  );
};

export default IndexPage;