// Galería de la boda · las historias de la noche, como las de Instagram. docs/pantallas.md § 6.9 › Ver las fotos.
// Tableros: GaleriaBoda-carrusel-c (celular) y GaleriaBoda-historias-escritorio (computadora); la lógica de su
// <script> es la especificación del comportamiento. Un solo DOM: galeria-boda.css lo acomoda según el tamaño.
//
// - Cada foto dura 5 s y pasa sola (la barra dorada es una animación CSS; al terminar, avanza).
// - Un toque en el tercio izquierdo regresa; en el resto avanza. Mantener presionado (≥ 250 ms) pausa; al
//   soltar sigue sin brincarse. En la primera, regresar la vuelve a empezar; después de la última, la primera.
// - Computadora: flechas a los lados, botón de pausa y teclado (flechas y barra espaciadora).
// - Empieza donde la persona se quedó (guardado en el navegador) o, la primera vez, en la primera.
// - Las fotos nunca se recortan: completas y centradas, con ellas mismas desenfocadas detrás.
// - Sólo se montan la foto actual y sus vecinas (la siguiente se precarga y la anterior se desvanece).
// TODO(backend): las fotos que llegan mientras se ven se agregan al final (consulta periódica al servidor).
import { useCallback, useEffect, useRef, useState } from 'react';
import { hora } from '@/lib/fechas.js';
import { UMBRAL_TOQUE_MS, VENTANA_BARRAS, cifra } from './galeria-boda.data.js';

/** @typedef {import('./galeria-boda.data.js').Foto} Foto */

/**
 * @typedef {Object} Props
 * @property {Foto[]} fotos por orden de llegada
 * @property {number} total fotos compartidas
 * @property {string} volver dirección de subir fotos ("Volver")
 */

const GUARDADA = 'galeria-boda:historia';
const flechaIzq = 'M14.5 6l-6 6 6 6';
const flechaDer = 'M9.5 6l6 6-6 6';

/** @param {{ foto: Foto, clase: string }} p */
function Imagen({ foto, clase }) {
  if (foto.fondo) return <span className={clase} style={{ background: foto.fondo }} />;
  const src = clase.includes('completa') ? foto.src : (foto.miniatura ?? foto.src);
  return <img className={clase} src={src} alt="" decoding="async" draggable="false" />;
}

/** @param {Props} props */
export default function Historias({ fotos, total, volver }) {
  const N = fotos.length;
  const [i, setI] = useState(0);
  const [presionado, setPresionado] = useState(false);
  const [detenido, setDetenido] = useState(false);
  const [vuelta, setVuelta] = useState(0); // alterna la animación para que la barra siempre empiece de cero
  const toque = useRef({ t0: 0, lado: 1 });

  const ir = useCallback(
    (/** @type {number} */ d) => {
      setI((k) => (d < 0 ? Math.max(k - 1, 0) : (k + 1) % N));
      setVuelta((v) => (v ? 0 : 1));
      setPresionado(false);
      setDetenido(false);
    },
    [N],
  );

  // Empieza donde se quedó.
  useEffect(() => {
    try {
      const id = localStorage.getItem(GUARDADA);
      const k = fotos.findIndex((f) => f.id === id);
      if (k > 0) setI(k);
    } catch {
      /* sin almacenamiento: empieza en la primera */
    }
  }, [fotos]);

  useEffect(() => {
    try {
      if (fotos[i]) localStorage.setItem(GUARDADA, fotos[i].id);
    } catch {
      /* sin almacenamiento */
    }
  }, [i, fotos]);

  // Teclado (computadora): flechas y barra espaciadora.
  useEffect(() => {
    /** @param {KeyboardEvent} e */
    const tecla = (e) => {
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === 'ArrowRight') ir(1);
      else if (e.key === 'ArrowLeft') ir(-1);
      else if (e.key === ' ' && !(e.target instanceof HTMLButtonElement) && !(e.target instanceof HTMLAnchorElement)) {
        e.preventDefault();
        setDetenido((z) => !z);
      } else return;
    };
    document.addEventListener('keydown', tecla);
    return () => document.removeEventListener('keydown', tecla);
  }, [ir]);

  if (!N) return null;

  /** @param {React.PointerEvent<HTMLDivElement>} e */
  const abajo = (e) => {
    if (e.button !== 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    toque.current = { t0: Date.now(), lado: e.clientX - r.left < r.width / 3 ? -1 : 1 };
    setPresionado(true);
  };
  const arriba = () => {
    if (!toque.current.t0) return;
    const fueToque = Date.now() - toque.current.t0 < UMBRAL_TOQUE_MS;
    toque.current.t0 = 0;
    if (fueToque) ir(toque.current.lado);
    else setPresionado(false);
  };
  const fuera = () => {
    if (!toque.current.t0) return;
    toque.current.t0 = 0;
    setPresionado(false);
  };

  // Ventana de fotos montadas: la anterior, la actual y la siguiente (con la vuelta de la última a la primera).
  const ventana = [...new Set([(i - 1 + N) % N, i, (i + 1) % N])];
  // Con muchas fotos, unas 30 barras que se recorren con la actual.
  const desde = N <= VENTANA_BARRAS ? 0 : Math.min(Math.max(i - Math.floor(VENTANA_BARRAS / 2), 0), N - VENTANA_BARRAS);
  const barras = Array.from({ length: Math.min(N, VENTANA_BARRAS) }, (_, k) => desde + k);
  const enPausa = presionado || detenido;

  const capas = (/** @type {'fondo' | 'historia'} */ donde) =>
    ventana.map((k) => (
      <div key={fotos[k].id} className={`historias__foto${k === i ? ' is-on' : ''}`} aria-hidden={k !== i}>
        <Imagen foto={fotos[k]} clase="historias__desenfoque" />
        {donde === 'historia' && <Imagen foto={fotos[k]} clase="historias__completa" />}
      </div>
    ));

  return (
    <div className={`historias${enPausa ? ' is-paused' : ''}`}>
      <div className="historias__fondo" aria-hidden="true">
        {capas('fondo')}
      </div>

      <a className="historias__volver historias__volver--lado" href={volver}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={flechaIzq} />
        </svg>
        Volver
      </a>
      <p className="historias__ayuda">Flechas para avanzar o regresar · barra espaciadora para pausar</p>
      <button type="button" className="historias__flecha historias__flecha--anterior" aria-label="Foto anterior" onClick={() => ir(-1)}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={flechaIzq} />
        </svg>
      </button>
      <button type="button" className="historias__flecha historias__flecha--siguiente" aria-label="Foto siguiente" onClick={() => ir(1)}>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d={flechaDer} />
        </svg>
      </button>

      <div className="historias__historia">
        <div className="historias__fotos">{capas('historia')}</div>
        <div className="historias__velo historias__velo--arriba" aria-hidden="true" />
        <div className="historias__velo historias__velo--abajo" aria-hidden="true" />

        <div className="historias__barras" aria-hidden="true">
          {barras.map((k) => (
            <span
              key={k}
              className={`historias__barra${k < i ? ' is-done' : k === i ? (vuelta ? ' is-now-b' : ' is-now-a') : ''}`}
            >
              <i onAnimationEnd={k === i ? (e) => /^historias-avance/.test(e.animationName) && ir(1) : undefined} />
            </span>
          ))}
        </div>
        <p className="historias__total">{cifra(total)} fotos</p>
        <button
          type="button"
          className="historias__pausa"
          aria-label={detenido ? 'Reanudar' : 'Pausar'}
          onClick={() => setDetenido((z) => !z)}
        >
          <svg viewBox="0 0 24 24" aria-hidden="true">
            {detenido ? <path className="historias__reanudar" d="M8.5 6.2l9.5 5.8-9.5 5.8z" /> : <path d="M9 6.5v11M15 6.5v11" />}
          </svg>
        </button>

        <p className="historias__noche">nuestra noche</p>
        <div className="historias__pie" aria-live="polite">
          {ventana.map((k) => (
            <div key={fotos[k].id} className={`historias__quien${k === i ? ' is-on' : ''}`} aria-hidden={k !== i}>
              {fotos[k].familia && <p className="historias__familia">{fotos[k].familia}</p>}
              {fotos[k].subida && <p className="historias__hora">{hora(/** @type {string} */ (fotos[k].subida))}</p>}
            </div>
          ))}
        </div>

        <div
          className="historias__toque"
          role="button"
          tabIndex={0}
          aria-label="Historias: toca a la derecha para la siguiente foto, a la izquierda para la anterior; mantén presionado para pausar"
          onPointerDown={abajo}
          onPointerUp={arriba}
          onPointerLeave={fuera}
          onPointerCancel={fuera}
          onContextMenu={(e) => e.preventDefault()}
        />

        <a className="historias__volver historias__volver--celular" href={volver}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d={flechaIzq} />
          </svg>
          Volver
        </a>
      </div>
    </div>
  );
}
