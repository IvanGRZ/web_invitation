// Galería de la boda · subir fotos ("el obturador"). docs/pantallas.md § 6.9.
// Tableros: GaleriaBoda-subir-c / -subir-escritorio y sus mensajes (-vacia, -offline, -rechazo, -fallo, -listo).
// Un solo DOM para celular y computadora: galeria-boda.css acomoda cada pieza según el tamaño.
//
// Vistas (se deducen del lote de fotos que se está subiendo):
//   vacia      la galería recién abierta, sin fotos: "Estrena el rollo"
//   reposo     sin subida en curso
//   subiendo   "Subiendo 2 de 3", el anillo dorado marca el avance
//   sinsenal   "En pausa · 1 de 3": las fotos esperan en la cola y se reintentan solas al volver la conexión
//   fallo      alguna foto no se pudo guardar: "Reintentar"
//   rechazo    algún archivo no era foto o pesaba más de 25 MB (validado antes de subir)
//   listo      todo subió: palomita, "¡Gracias!" y "Verlas ahora"
//
// Sin JS: el círculo es la etiqueta del selector de archivos (lo abre sin JS) y aparece un botón para enviar el
// formulario (TODO(backend): la Action que recibe las fotos sin comprimir).
import { useCallback, useEffect, useRef, useState } from 'react';
import { LUGARES_TUS_FOTOS, cifra, textos } from './galeria-boda.data.js';
import { SinSenal, comprimir, subidaSimulada, subir, validar } from './subida.js';

/** @typedef {import('./galeria-boda.data.js').Foto} Foto */

/**
 * @typedef {Object} Lote fotos elegidas de una vez (o mientras otras siguen subiendo)
 * @property {number} n archivos elegidos (los rechazados incluidos)
 * @property {number} hechas compartidas
 * @property {number} pendientes en la cola (incluida la que sube)
 * @property {number} avance anillo dorado mientras sube, de 0 a 1
 * @property {number} [desde] de dónde se completa el anillo al terminar
 * @property {{ nombre: string, razon: string }[]} rechazadas
 * @property {Foto[]} fallidas
 */

/**
 * @typedef {Object} Props
 * @property {string | null} familia "Familia García" con /i/<codigo>; null con el enlace general
 * @property {number} total recuerdos compartidos por todos
 * @property {Foto[]} [mias] "Tus fotos", la más reciente primero
 * @property {string} historias dirección de las historias
 * @property {string} volver dirección de la invitación
 * @property {string} [accion] action del formulario sin JS (TODO(backend))
 * @property {{ demoraMs?: number, fallar?: number }} [simular] sólo páginas de muestra: subida sin backend
 * @property {{ lote?: Lote, enLinea?: boolean, nuevas?: string[] }} [inicio] sólo páginas de muestra: estado inicial
 */

const camara = [
  'M4 8.5h3l1.6-2.4h6.8L17 8.5h3a1.5 1.5 0 0 1 1.5 1.5v8a1.5 1.5 0 0 1-1.5 1.5H4A1.5 1.5 0 0 1 2.5 18v-8A1.5 1.5 0 0 1 4 8.5z',
];
const palomita = 'M5 12.5l4.5 4.5L19 7.5';
const sinSenal = [
  'M2.5 8.8a14 14 0 0 1 6.2-3.2M15.3 5.6a14 14 0 0 1 6.2 3.2',
  'M5.8 12.3a9 9 0 0 1 3.6-2M14.6 10.3a9 9 0 0 1 3.6 2',
  'M9.3 15.6a4.5 4.5 0 0 1 5.4 0',
  'M12 19.2h.01',
  'M3.5 3.5l17 17',
];
const alerta = ['M12 3.8L21 19.5H3z', 'M12 10v4.2', 'M12 16.9v.1'];
const reintentar = ['M19.5 12a7.5 7.5 0 1 1-2.2-5.3', 'M19.8 4.2v4.6h-4.6'];
const flecha = 'M14.5 6l-6 6 6 6';

/** @param {{ d: string | string[], className: string, children?: any }} p */
function Icono({ d, className, children }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      {(Array.isArray(d) ? d : [d]).map((p) => (
        <path key={p} d={p} />
      ))}
      {children}
    </svg>
  );
}

/** @param {number} n */
const r2 = (n) => Math.max(0, Math.round(n * 100) / 100);

/** @param {{ foto: Foto, conPalomita?: boolean, className?: string, error?: boolean }} p */
function Miniatura({ foto, conPalomita = false, className = '', error = false }) {
  return (
    <div className={`galeria-boda__mini ${className}`}>
      <span className="galeria-boda__mini-foto" style={foto.fondo ? { background: foto.fondo } : undefined}>
        {foto.miniatura && <img src={foto.miniatura} alt="" decoding="async" />}
      </span>
      {conPalomita && (
        <span className="galeria-boda__mini-sello">
          <Icono d={palomita} className="galeria-boda__mini-icono" />
        </span>
      )}
      {error && (
        <span className="galeria-boda__mini-sello galeria-boda__mini-sello--error">
          <Icono d={['M12 7v6', 'M12 16.6v.1']} className="galeria-boda__mini-icono" />
        </span>
      )}
    </div>
  );
}

/** @param {Props} props */
export default function SubirFotos({ familia, total: totalInicial, mias: miasIniciales = [], historias, volver, accion, simular, inicio }) {
  const [total, setTotal] = useState(totalInicial);
  const [mias, setMias] = useState(miasIniciales);
  const [lote, setLote] = useState(/** @type {Lote | null} */ (inicio?.lote ?? null));
  const [enLinea, setEnLinea] = useState(inicio?.enLinea ?? true);
  const [nuevas, setNuevas] = useState(inicio?.nuevas ?? []);
  const [entro, setEntro] = useState(false);
  const [arrastrando, setArrastrando] = useState(false);

  /** @type {React.MutableRefObject<{ id: string, archivo: File, envio?: { foto: Blob, miniatura: Blob }, url?: string }[]>} */
  const cola = useRef([]);
  const procesando = useRef(false);
  const subirRef = useRef(simular ? subidaSimulada(simular) : subir);
  const entrada = useRef(/** @type {HTMLInputElement | null} */ (null));

  // Después de la entrada, lo que aparece por un cambio de estado entra sin esperar los retrasos del tablero.
  useEffect(() => {
    const t = setTimeout(() => setEntro(true), 3200);
    return () => clearTimeout(t);
  }, []);

  const procesar = useCallback(async () => {
    if (procesando.current) return;
    procesando.current = true;
    try {
      while (cola.current.length) {
        const item = cola.current[0];
        if (!navigator.onLine) {
          setEnLinea(false);
          break;
        }
        if (!item.envio) {
          try {
            item.envio = await comprimir(item.archivo);
            item.url = URL.createObjectURL(item.envio.miniatura);
          } catch {
            cola.current.shift();
            setLote((l) => l && { ...l, pendientes: l.pendientes - 1, rechazadas: [...l.rechazadas, { nombre: item.archivo.name, razon: textos.razones.lectura }] });
            continue;
          }
        }
        const { foto, miniatura } = item.envio;
        try {
          await subirRef.current({
            foto,
            miniatura,
            alAvanzar: (a) => setLote((l) => l && { ...l, avance: (l.n - l.pendientes + a) / l.n }),
          });
          cola.current.shift();
          const nueva = { id: item.id, miniatura: item.url };
          setTotal((t) => t + 1);
          setMias((m) => [nueva, ...m]);
          setNuevas((nv) => [item.id, ...nv]);
          setLote((l) => {
            if (!l) return l;
            const pendientes = l.pendientes - 1;
            return { ...l, hechas: l.hechas + 1, pendientes, avance: (l.n - pendientes) / l.n, desde: pendientes === 0 ? l.avance : l.desde };
          });
        } catch (error) {
          if (error instanceof SinSenal || !navigator.onLine) {
            setEnLinea(false);
            break;
          }
          cola.current.shift();
          setLote((l) => l && { ...l, pendientes: l.pendientes - 1, fallidas: [...l.fallidas, { id: item.id, miniatura: item.url, envio: item.envio, archivo: item.archivo }] });
        }
      }
    } finally {
      procesando.current = false;
    }
  }, []);

  // La cola se reanuda sola al volver la conexión.
  useEffect(() => {
    const conectado = () => {
      setEnLinea(true);
      procesar();
    };
    const desconectado = () => setEnLinea(false);
    window.addEventListener('online', conectado);
    window.addEventListener('offline', desconectado);
    return () => {
      window.removeEventListener('online', conectado);
      window.removeEventListener('offline', desconectado);
    };
  }, [procesar]);

  /** @param {FileList | File[]} lista */
  const elegir = (lista) => {
    const archivos = [...lista];
    if (!archivos.length) return;
    const rechazadas = [];
    for (const archivo of archivos) {
      const razon = validar(archivo);
      if (razon) rechazadas.push({ nombre: archivo.name, razon });
      else cola.current.push({ id: `local-${Date.now()}-${cola.current.length}-${archivo.name}`, archivo });
    }
    const validas = archivos.length - rechazadas.length;
    setLote((l) => {
      // Mientras otras siguen subiendo, se suman al mismo lote; si no, empieza uno nuevo.
      if (l && l.pendientes > 0) {
        return { ...l, n: l.n + archivos.length, pendientes: l.pendientes + validas, rechazadas: [...l.rechazadas, ...rechazadas] };
      }
      return { n: archivos.length, hechas: 0, pendientes: validas, avance: 0, rechazadas, fallidas: [] };
    });
    if (!lote || lote.pendientes === 0) setNuevas([]);
    procesar();
  };

  const reintentarAhora = () => {
    setEnLinea(navigator.onLine);
    procesar();
  };

  const reintentarFallidas = () => {
    if (!lote) return;
    let otraVez = 0;
    for (const f of lote.fallidas) {
      const { envio, archivo } = /** @type {any} */ (f);
      if (!archivo) continue;
      cola.current.push({ id: f.id, archivo, envio, url: f.miniatura });
      otraVez += 1;
    }
    setLote({ ...lote, pendientes: lote.pendientes + otraVez, fallidas: lote.fallidas.filter((f) => !(/** @type {any} */ (f).archivo)) });
    procesar();
  };

  /** @param {React.DragEvent} e */
  const alArrastrar = (e) => {
    if (![...e.dataTransfer.types].includes('Files')) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = 'copy';
    setArrastrando(true);
  };
  /** @param {React.DragEvent} e */
  const alSoltar = (e) => {
    e.preventDefault();
    setArrastrando(false);
    elegir(e.dataTransfer.files);
  };

  // Un archivo soltado fuera del círculo no debe abrirse en la pestaña (se perdería la página).
  useEffect(() => {
    /** @param {DragEvent} e */
    const evitar = (e) => {
      if (e.dataTransfer && [...e.dataTransfer.types].includes('Files')) e.preventDefault();
    };
    window.addEventListener('dragover', evitar);
    window.addEventListener('drop', evitar);
    return () => {
      window.removeEventListener('dragover', evitar);
      window.removeEventListener('drop', evitar);
    };
  }, []);

  /* ─── Vista ─────────────────────────────────────────────────────── */

  const vista = !lote
    ? total === 0
      ? 'vacia'
      : 'reposo'
    : lote.pendientes > 0
      ? enLinea
        ? 'subiendo'
        : 'sinsenal'
      : lote.fallidas.length
        ? 'fallo'
        : lote.rechazadas.length
          ? 'rechazo'
          : lote.hechas > 0
            ? 'listo'
            : total === 0
              ? 'vacia'
              : 'reposo';

  const anilloVivo = vista === 'vacia' || vista === 'reposo' || vista === 'subiendo' || vista === 'listo';
  const conAviso = vista === 'sinsenal' || vista === 'fallo' || vista === 'rechazo' || vista === 'listo';
  const n = lote?.n ?? 0;
  const hechas = lote?.hechas ?? 0;

  /** @type {string | null} */
  let estado = null;
  if (vista === 'subiendo' && lote) estado = textos.subiendo(Math.min(n, n - lote.pendientes + 1), n);
  if (vista === 'sinsenal') estado = textos.enPausa(hechas, n);
  if (vista === 'fallo' || vista === 'rechazo') estado = textos.compartidas(hechas, n);
  if (vista === 'listo') estado = textos.listas(hechas);

  const tusFotos = mias.slice(0, LUGARES_TUS_FOTOS);
  const conPalomita = (/** @type {Foto} */ f) => vista === 'listo' && nuevas.includes(f.id);

  /** Arcos del anillo: dorado lo subido, palo de rosa lo que falló (con su separación, como en el lienzo). */
  const arcos = [];
  if ((vista === 'subiendo' || vista === 'sinsenal') && lote) arcos.push({ clase: 'oro', largo: r2(lote.avance) });
  if ((vista === 'fallo' || vista === 'rechazo') && lote && n) {
    if (hechas) arcos.push({ clase: 'oro', largo: r2(hechas / n - 0.025) });
    arcos.push({ clase: 'rosa', largo: r2((n - hechas) / n - 0.05), desfase: -r2(hechas / n + 0.015) });
  }
  if (vista === 'listo') arcos.push({ clase: 'oro galeria-boda__arco--completo', largo: 1, desde: lote?.desde ?? 1 });

  const anillo = (/** @type {number} */ c, /** @type {number} */ rPuntos, /** @type {number} */ r, /** @type {string} */ tamano) => (
    <svg className={`galeria-boda__anillo galeria-boda__anillo--${tamano}`} viewBox={`0 0 ${c * 2} ${c * 2}`} aria-hidden="true">
      <defs>
        <linearGradient id={`galeria-boda-oro-${tamano}`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#b8955a" />
          <stop offset="1" stopColor="#e8cf9c" />
        </linearGradient>
      </defs>
      <circle className="galeria-boda__puntos" cx={c} cy={c} r={rPuntos} />
      <circle className="galeria-boda__pista" cx={c} cy={c} r={r} />
      {arcos.map((a) => (
        <circle
          key={a.clase}
          className={`galeria-boda__arco galeria-boda__arco--${a.clase}`}
          cx={c}
          cy={c}
          r={r}
          pathLength="1"
          strokeDasharray={`${a.largo} 1`}
          strokeDashoffset={a.desfase}
          style={a.desde !== undefined ? /** @type {any} */ ({ '--desde': a.desde }) : undefined}
        />
      ))}
    </svg>
  );

  const enlaceHistorias = (/** @type {string} */ clase) => (
    <a className={`galeria-boda__enlace ${clase}`} href={historias}>
      Ver las historias de la noche
    </a>
  );

  const tira = (/** @type {string} */ clase) => (
    <div className={`galeria-boda__tira ${clase}`} aria-label="Tus fotos">
      {vista === 'vacia'
        ? Array.from({ length: LUGARES_TUS_FOTOS }, (_, i) => <span key={i} className="galeria-boda__mini galeria-boda__mini--vacia" />)
        : tusFotos.map((f) => <Miniatura key={f.id} foto={f} conPalomita={conPalomita(f)} />)}
    </div>
  );

  return (
    <form
      className={[
        'galeria-boda__subir',
        `galeria-boda__subir--${vista}`,
        anilloVivo ? 'is-vivo' : '',
        entro ? 'is-entro' : '',
        familia ? 'is-familia' : '',
      ].join(' ')}
      method="post"
      encType="multipart/form-data"
      action={accion}
      onSubmit={(e) => e.preventDefault()}
    >
      <a className="galeria-boda__volver" href={volver}>
        <Icono d={flecha} className="galeria-boda__volver-icono" />
        Volver a la invitación
      </a>

      <p className="galeria-boda__ceja" data-a="suave d1">
        Galería de la boda
      </p>
      {vista === 'vacia' ? (
        <>
          <h1 className="galeria-boda__estrena" data-a="sube d2">
            Estrena el rollo
          </h1>
          <p className="galeria-boda__estrena-nota" data-a="suave d3">
            La galería ya está abierta. Comparte la primera foto de la noche.
          </p>
        </>
      ) : (
        <>
          <h1 className="galeria-boda__cuenta">
            <span className="galeria-boda__cifra" data-a="sube d2">
              {cifra(total)}
            </span>{' '}
            <span className="galeria-boda__cuenta-texto" data-a="suave d2">
              recuerdos compartidos esta noche
            </span>
          </h1>
        </>
      )}

      <input
        ref={entrada}
        id="galeria-boda-archivos"
        className="galeria-boda__archivos"
        type="file"
        name="fotos"
        accept="image/*"
        multiple
        onChange={(e) => {
          if (e.currentTarget.files) elegir(e.currentTarget.files);
          e.currentTarget.value = '';
        }}
      />
      <label
        htmlFor="galeria-boda-archivos"
        className={`galeria-boda__obturador${arrastrando ? ' is-arrastrando' : ''}`}
        data-a="sube d4"
        onDragOver={alArrastrar}
        onDragEnter={alArrastrar}
        onDragLeave={() => setArrastrando(false)}
        onDrop={alSoltar}
      >
        <span className="galeria-boda__latido" aria-hidden="true" />
        {anillo(124, 118, 108, 'celular')}
        {anillo(170, 164, 154, 'computadora')}
        <span className="galeria-boda__vidrio">
          {vista === 'listo' ? (
            <Icono d={[]} className="galeria-boda__camara galeria-boda__camara--lista">
              <path className="galeria-boda__palomita" pathLength="1" d={palomita} />
            </Icono>
          ) : (
            <Icono d={camara} className="galeria-boda__camara">
              <circle cx="12" cy="13.6" r="3.6" />
            </Icono>
          )}
          <span className="galeria-boda__obturador-texto">
            Compartir
            <br />
            {vista === 'listo' ? 'más fotos' : 'mis fotos'}
          </span>
          <span className="galeria-boda__arrastra" aria-hidden="true">
            o arrástralas aquí
          </span>
        </span>
      </label>

      {estado && (
        <p className={`galeria-boda__estado galeria-boda__estado--${vista}`} role="status" data-a="suave d5">
          {estado}
        </p>
      )}

      <p className={`galeria-boda__tus${conAviso ? ' galeria-boda__solo-lado' : ''}`} data-a="suave d6">
        Tus fotos
      </p>
      {total > 0 && vista !== 'vacia' && enlaceHistorias(`galeria-boda__enlace--principal${conAviso ? ' galeria-boda__solo-lado' : ''}`)}
      {tira(`galeria-boda__tira--principal${conAviso ? ' galeria-boda__solo-lado' : ''}`)}

      {conAviso && lote && (
        <div className="galeria-boda__avisos" data-a="sube d5">
          {vista === 'sinsenal' && (
            <div className="galeria-boda__aviso" role="status">
              <span className="galeria-boda__aviso-icono">
                <Icono d={sinSenal} className="galeria-boda__aviso-svg" />
              </span>
              <div className="galeria-boda__aviso-cuerpo">
                <p className="galeria-boda__aviso-titulo">Sin señal por ahora</p>
                <div className="galeria-boda__aviso-texto">
                  Tus fotos esperan aquí y se suben solas en cuanto vuelva la conexión. No cierres esta pantalla.
                </div>
                <button type="button" className="galeria-boda__reintentar" onClick={reintentarAhora}>
                  <Icono d={reintentar} className="galeria-boda__reintentar-icono" />
                  Reintentar ahora
                </button>
              </div>
            </div>
          )}
          {vista === 'rechazo' && (
            <div className="galeria-boda__aviso galeria-boda__aviso--error" role="alert">
              <span className="galeria-boda__aviso-icono">
                <Icono d={alerta} className="galeria-boda__aviso-svg" />
              </span>
              <div className="galeria-boda__aviso-cuerpo">
                <p className="galeria-boda__aviso-titulo">{textos.rechazadas(lote.rechazadas.length)}</p>
                <div className="galeria-boda__aviso-texto">
                  Sólo se pueden compartir fotos.
                  <div className="galeria-boda__rechazos">
                    {lote.rechazadas.map((r, i) => (
                      <div key={`${r.nombre}-${i}`} className="galeria-boda__rechazo">
                        <span className="galeria-boda__rechazo-nombre">{r.nombre}</span>
                        <span className="galeria-boda__rechazo-razon">{r.razon}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
          {vista === 'fallo' && (
            <div className="galeria-boda__aviso galeria-boda__aviso--error" role="alert">
              <Miniatura foto={lote.fallidas[0]} error className="galeria-boda__mini--fallida" />
              <div className="galeria-boda__aviso-cuerpo">
                <p className="galeria-boda__aviso-titulo">{textos.fallidas(lote.fallidas.length)}</p>
                <div className="galeria-boda__aviso-texto">Fue un problema nuestro, no de tu foto. Vuelve a intentarlo.</div>
                <button type="button" className="galeria-boda__reintentar" onClick={reintentarFallidas}>
                  <Icono d={reintentar} className="galeria-boda__reintentar-icono" />
                  Reintentar
                </button>
              </div>
            </div>
          )}
          {vista === 'listo' && (
            <div className="galeria-boda__aviso galeria-boda__aviso--listo" role="status">
              <span className="galeria-boda__aviso-icono">
                <Icono d={palomita} className="galeria-boda__aviso-svg" />
              </span>
              <div className="galeria-boda__aviso-cuerpo">
                <p className="galeria-boda__aviso-titulo">¡Gracias!</p>
                <div className="galeria-boda__aviso-texto">Tus fotos ya están en las historias de la noche.</div>
                <a className="galeria-boda__enlace galeria-boda__enlace--aviso" href={historias}>
                  Verlas ahora
                </a>
              </div>
            </div>
          )}
          {vista === 'listo'
            ? tira('galeria-boda__tira--aviso')
            : total > 0 && <p className="galeria-boda__aviso-pie">{enlaceHistorias('galeria-boda__enlace--aviso-pie')}</p>}
        </div>
      )}

      {!conAviso && (
        <p className="galeria-boda__nota galeria-boda__nota--celular" data-a="suave d7">
          Puedes elegir varias a la vez. Deja esta pantalla abierta mientras se suben.
        </p>
      )}
      <p className="galeria-boda__nota galeria-boda__nota--lado" data-a="suave d7">
        Puedes elegir varias a la vez o arrastrarlas al círculo.
      </p>

      {familia && (
        <p className="galeria-boda__como" data-a="suave d7">
          Compartiendo como <span className="galeria-boda__familia">{familia}</span>
        </p>
      )}

      <button type="submit" className="btn btn--secondary galeria-boda__enviar-sinjs">
        Compartir las fotos elegidas
      </button>
    </form>
  );
}
