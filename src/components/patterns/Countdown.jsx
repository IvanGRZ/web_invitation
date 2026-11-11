// Cuenta regresiva en vivo (isla de React, client:visible).
// En el servidor se pinta un valor estable (ceros) y el cliente pone las cifras reales al hidratar,
// para que el HTML del servidor y el del cliente coincidan (sin errores de hidratación).
import { useEffect, useState } from 'react';
import { desglosar, dosDigitos } from '@/lib/cuenta-regresiva.js';
import styles from './Countdown.module.css';

const ETIQUETAS = { dias: 'días', horas: 'horas', minutos: 'min', segundos: 'seg' };

/**
 * @param {Object} props
 * @param {string} props.target instante objetivo ISO 8601 con offset (p. ej. 2027-02-20T18:00:00-06:00)
 * @param {string} [props.label] nombre accesible del temporizador
 * @param {string} [props.className]
 */
export default function Countdown({ target, label = 'Tiempo para la boda', className }) {
  const objetivo = Date.parse(target);
  const [tiempo, setTiempo] = useState(/** @type {ReturnType<typeof desglosar> | null} */ (null));

  useEffect(() => {
    /** @type {ReturnType<typeof setTimeout> | undefined} */
    let temporizador;

    const actualizar = () => {
      const ahora = Date.now();
      const desglose = desglosar(objetivo, ahora);
      setTiempo(desglose);
      if (!desglose.terminado) {
        // Se programa al inicio del siguiente segundo para que el cambio caiga a tiempo.
        temporizador = setTimeout(actualizar, 1000 - (ahora % 1000));
      }
    };

    actualizar();
    return () => clearTimeout(temporizador);
  }, [objetivo]);

  const unidades = [
    { clave: 'dias', valor: tiempo ? String(tiempo.dias) : '0', ancha: true },
    { clave: 'horas', valor: dosDigitos(tiempo?.horas ?? 0) },
    { clave: 'minutos', valor: dosDigitos(tiempo?.minutos ?? 0) },
    { clave: 'segundos', valor: dosDigitos(tiempo?.segundos ?? 0) },
  ];

  return (
    <div role="timer" aria-label={label} className={[styles.countdown, className].filter(Boolean).join(' ')}>
      {unidades.map(({ clave, valor, ancha }, i) => (
        <div key={clave} className={styles.grupo}>
          {i > 0 && (
            <span className={styles.separador} aria-hidden="true">
              :
            </span>
          )}
          <div className={ancha ? `${styles.unidad} ${styles.unidadAncha}` : styles.unidad}>
            <span className={styles.numero}>{valor}</span>
            <span className={styles.etiqueta}>{ETIQUETAS[/** @type {keyof typeof ETIQUETAS} */ (clave)]}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
