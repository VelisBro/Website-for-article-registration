'use client';

import { useEffect, useRef } from 'react';

export default function YandexMap() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    mapRef.current.innerHTML = '';

    const script = document.createElement('script');
    script.src =
      'https://api-maps.yandex.ru/services/constructor/1.0/js/?um=constructor%3A9cbfce4bd75d7a15eab995531e42d53e76f60bfdef9ac44ddf9accfa32bd25ce&width=740&height=400&lang=ru_RU&scroll=true';
    script.async = true;
    script.type = 'text/javascript';
    script.charset = 'utf-8';

    mapRef.current.appendChild(script);

    return () => {
      if (mapRef.current) {
        mapRef.current.innerHTML = '';
      }
    };
  }, []);

  return <div ref={mapRef} className="h-[400px] w-[740px]" />;
}