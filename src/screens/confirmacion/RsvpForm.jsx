// Pantalla aparte · Confirmación (docs/pantallas.md § 6.7): isla de React (client:load) con los pasos
// y los estados. Tableros del lienzo: ConfirmacionD2 (390×844), ConfirmacionEscritorio (1440×900) y
// ConfEstado-* (candado, inválido, error al guardar, regreso, cerrada), en celular y computadora.
//
// Un solo DOM para los dos tamaños: confirmacion.css acomoda las piezas en una columna (celular) o en dos
// mitades (computadora: el pase a la izquierda, el paso a la derecha). Lo que sólo existe en un tamaño lleva
// la clase `confirmacion__cel` o `confirmacion__pc`.
//
// Entrada de cada paso: cada bloque sube 14 px y aparece, escalonado como en el lienzo. Como el orden de los
// bloques no es el mismo en celular y en computadora, cada uno lleva su retraso para cada tamaño (anim()).
//
// Datos que envía: { attending, guests, message } (guests = sillas ocupadas; 0 si no asisten). Mientras no
// exista el backend, guardar() sólo simula (ver la nota en guardar()).
import { useEffect, useRef, useState } from 'react';
import Button from '@/components/ui/Button.jsx';
import { CASCADA_S, CODIGO_LARGO, LUGARES_MAX, MENSAJE_MAX, destellos } from './confirmacion.data.js';

/** Silla Luis XVI de frente (viewBox 0 0 40 64): armazón, asiento acolchado y patas. */
const ARMAZON =
  'M9 31L8 38M31 31l1 7M5 38h30q2 0 2 2v3q0 2-2 2H5q-2 0-2-2v-3q0-2 2-2zM7 45l-1 17M33 45l1 17M12 45v12M28 45v12';

/**
 * @typedef {'candado' | 'p0' | 'p1' | 'p2' | 'hecho' | 'regreso' | 'cerrada'} Vista
 * @typedef {{ asiste: boolean, invitados: number, mensaje?: string, recibida: string }} Respuesta
 * @typedef {{ mes: string, dia: string, fecha: string, nota: string, frase: string }} Limite
 *   mes "ENE", dia "23", fecha "Sábado 23 de enero de 2027", nota "23 de enero de 2027",
 *   frase "sábado 23 de enero de 2027"
 * @typedef {{ vista?: Vista, si?: boolean, n?: number, mensaje?: string, error?: boolean, codigo?: string,
 *   codigoInvalido?: boolean }} Inicio estado con el que abre (sólo las páginas de muestra)
 * @typedef {{ codigoValido?: string, destinoValido?: string, fallarGuardado?: boolean }} Simular
 */

/**
 * Retrasos de entrada de un bloque: en celular (dc) y en computadora (dp), en segundos.
 * Sin valor, el bloque no tiene entrada propia en ese tamaño.
 * @param {number | null} dc
 * @param {number | null} [dp]
 */
function anim(dc, dp = null) {
  const a = dc != null && dp != null ? 'ambos' : dc != null ? 'cel' : 'pc';
  /** @type {Record<string, string>} */
  const style = {};
  if (dc != null) style['--dc'] = `${dc}s`;
  if (dp != null) style['--dp'] = `${dp}s`;
  return { 'data-a': a, style };
}

const plural = (n, uno, varios) => `${n} ${n === 1 ? uno : varios}`;

/** Hoja de calendario de la fecha límite: bloc marfil con otra hoja detrás, dos argollas, "ENE" y "23". */
function Hoja({ limite, className, width = 44, height = 56, ...rest }) {
  return (
    <svg className={className} viewBox="0 0 44 56" width={width} height={height} aria-hidden="true" {...rest}>
      <rect x="4.5" y="10.5" width="37" height="43" rx="5" fill="#f1e9da" stroke="#9a7a45" strokeWidth=".8" strokeOpacity=".5" />
      <rect x="1.5" y="7.5" width="37" height="43" rx="5" fill="#fdfaf4" stroke="#9a7a45" strokeWidth="1" />
      <path d="M12 11V5a2.4 2.4 0 0 1 4.8 0v6M23.2 11V5a2.4 2.4 0 0 1 4.8 0v6" fill="none" stroke="#9a7a45" strokeWidth="1" strokeLinecap="round" />
      <circle cx="14.4" cy="11.4" r="1.1" fill="#9a7a45" />
      <circle cx="25.6" cy="11.4" r="1.1" fill="#9a7a45" />
      <text x="20" y="22.4" textAnchor="middle" className="confirmacion__hoja-mes">
        {limite.mes}
      </text>
      <path d="M10 26h20" stroke="#9a7a45" strokeWidth=".6" strokeOpacity=".7" />
      <text x="20" y="43.6" textAnchor="middle" className="confirmacion__hoja-dia">
        {limite.dia}
      </text>
    </svg>
  );
}

/** La fecha límite con su hoja de calendario (pie de los pasos). */
function FechaLimite({ limite, clave = 'Confirma a más tardar el', className = '', ...rest }) {
  return (
    <div className={`confirmacion__limite ${className}`} role="note" {...rest}>
      <Hoja limite={limite} className="confirmacion__hoja" />
      <div className="confirmacion__limite-texto">
        <span className="confirmacion__limite-clave">{clave}</span>
        <span className="confirmacion__limite-fecha">{limite.fecha}</span>
      </div>
    </div>
  );
}

/** Sillitas del pase o del resumen (sólo dibujo). */
function Sillitas({ lugares, ocupadas = 0, tam, className = '' }) {
  return (
    <span className={`confirmacion__sillitas confirmacion__sillitas--${tam} ${className}`} aria-hidden="true">
      {Array.from({ length: lugares }, (_, i) => (
        <svg key={i} viewBox="0 0 40 64" className={i < ocupadas ? 'is-on' : undefined}>
          <ellipse className="bk" cx="20" cy="17" rx="13" ry="16" />
          <path className="fr" d={ARMAZON} fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      ))}
    </span>
  );
}

/** Dibujo de una silla grande. */
function DibujoSilla() {
  return (
    <>
      <svg viewBox="0 0 40 64" aria-hidden="true">
        <ellipse className="bk" cx="20" cy="17" rx="13" ry="16" strokeWidth="1.2" />
        <ellipse className="in" cx="20" cy="17" rx="9" ry="12" fill="none" strokeWidth=".7" strokeOpacity=".85" />
        <path className="fr" d={ARMAZON} fill="none" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="confirmacion__sombra" aria-hidden="true" />
    </>
  );
}

/** Ícono de alerta (código inválido, error al guardar). */
function Alerta() {
  return (
    <svg className="confirmacion__alerta-icono" viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">
      <circle cx="8" cy="8" r="6.6" />
      <path d="M8 4.6v4.2M8 11.2v.1" />
    </svg>
  );
}

function Flecha() {
  return (
    <svg viewBox="0 0 24 24" width="15" height="15" aria-hidden="true">
      <path d="M14.5 6l-6 6 6 6" />
    </svg>
  );
}

/** Deja sólo letras y números en mayúsculas (se puede pegar "K7M2-PQ9X"). */
const limpiarCodigo = (texto) => texto.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, CODIGO_LARGO);

/**
 * @param {Object} props
 * @param {'candado' | 'pasos' | 'regreso' | 'cerrada'} props.estado
 * @param {string} [props.familia] p. ej. "Familia García" (todo menos el candado)
 * @param {number} [props.lugares] lugares del pase, 1–6
 * @param {Limite} props.limite fecha límite ya formateada
 * @param {{ el: string, ella: string, fecha: string }} props.novios nombres y fecha (izquierda del candado en computadora)
 * @param {Respuesta | null} [props.respuesta] lo que la familia ya respondió (regreso, cerrada)
 * @param {string} [props.recibida] fecha en que se recibió la respuesta, ya formateada ("12 de diciembre de 2026")
 * @param {string} props.volver dirección de la invitación ("Volver a la invitación")
 * @param {string} props.whatsapp enlace de WhatsApp de los novios
 * @param {string} [props.accion] action del formulario (la Action de Astro, cuando exista)
 * @param {string} props.destinoCodigo dirección a la que lleva un código, con "{codigo}" (candado)
 * @param {Simular} [props.simular] sólo páginas de muestra: resultados sin backend
 * @param {Inicio} [props.inicio] sólo páginas de muestra: estado con el que abre
 */
export default function RsvpForm({
  estado,
  familia = '',
  lugares = 1,
  limite,
  novios,
  respuesta = null,
  recibida = '',
  volver,
  whatsapp,
  accion,
  destinoCodigo,
  simular,
  inicio = {},
}) {
  const L = Math.min(LUGARES_MAX, Math.max(1, lugares));
  const asistio = respuesta ? respuesta.asiste : true;
  const ocupadasPrevias = respuesta ? (respuesta.asiste ? respuesta.invitados : 0) : L;

  const [vista, setVista] = useState(/** @type {Vista} */ (inicio.vista ?? (estado === 'pasos' ? 'p0' : estado)));
  const [si, setSi] = useState(inicio.si ?? asistio);
  // Al entrar, todas las sillas del pase ocupadas (o las que ya habían confirmado).
  const [n, setN] = useState(inicio.n ?? (ocupadasPrevias || L));
  const [prev, setPrev] = useState(inicio.n ?? (ocupadasPrevias || L));
  const [mensaje, setMensaje] = useState(inicio.mensaje ?? respuesta?.mensaje ?? '');
  const [error, setError] = useState(Boolean(inicio.error));
  const [guardando, setGuardando] = useState(false);
  const [codigo, setCodigo] = useState(limpiarCodigo(inicio.codigo ?? ''));
  const [codigoMalo, setCodigoMalo] = useState(Boolean(inicio.codigoInvalido));
  const [intentoCodigo, setIntentoCodigo] = useState(0);

  const titulo = useRef(/** @type {HTMLHeadingElement | null} */ (null));
  const yaMontado = useRef(false);
  const fallosSimulados = useRef(0);
  const cajaCodigo = useRef(/** @type {HTMLDivElement | null} */ (null));
  const campoCodigo = useRef(/** @type {HTMLInputElement | null} */ (null));

  // Candado: el cursor de la primera casilla ya está dibujado, así que el campo real nace con el foco
  // (se puede escribir sin tocar antes). preventScroll: no mueve el recorrido.
  useEffect(() => {
    if (vista === 'candado') campoCodigo.current?.focus({ preventScroll: true });
  }, [vista]);

  // Código inválido: la sacudida se repite en cada intento (se reinicia la animación).
  useEffect(() => {
    const caja = cajaCodigo.current;
    if (!intentoCodigo || !caja) return;
    caja.classList.remove('is-bad');
    void caja.offsetWidth;
    caja.classList.add('is-bad');
  }, [intentoCodigo]);

  // Al cambiar de paso, el foco va a la pregunta nueva (lectores de pantalla y teclado).
  useEffect(() => {
    if (yaMontado.current) titulo.current?.focus({ preventScroll: true });
    yaMontado.current = true;
  }, [vista]);

  /** @param {Vista} siguiente */
  const ir = (siguiente) => {
    setError(false);
    setVista(siguiente);
  };

  /** Sillas en orden: tocar una vacía ocupa todas hasta ella; tocar una ocupada la libera junto con las que siguen. */
  const tocarSilla = (i) => {
    setPrev(n);
    setN(i < n ? i : i + 1);
  };

  const atras = () => ir(vista === 'p2' && !si ? 'p0' : vista === 'p2' ? 'p1' : 'p0');

  /**
   * Guarda la respuesta. TODO(backend): llamar a la Action `rsvp` con { attending, guests, message }
   * (CLAUDE.md § 7 › RSVP). Hoy sólo existe la pantalla: las páginas de muestra simulan el resultado y,
   * sin simulación, se acepta sin guardar.
   * @param {{ attending: boolean, guests: number, message: string }} _datos
   */
  const guardar = async (_datos) => {
    await new Promise((r) => setTimeout(r, 450));
    if (simular?.fallarGuardado && fallosSimulados.current === 0) {
      fallosSimulados.current += 1;
      throw new Error('simulado');
    }
  };

  /** @param {import('react').FormEvent<HTMLFormElement>} evento */
  const enviar = async (evento) => {
    evento.preventDefault();
    if (vista === 'candado') return entrarConCodigo();
    if (vista !== 'p2' || guardando) return;
    setGuardando(true);
    try {
      await guardar({ attending: si, guests: si ? n : 0, message: mensaje.trim() });
      ir('hecho');
    } catch {
      setError(true);
    } finally {
      setGuardando(false);
    }
  };

  const entrarConCodigo = () => {
    if (codigo.length !== CODIGO_LARGO) return;
    // TODO(backend): validar el código en el servidor. Hoy sólo las páginas de muestra lo reconocen.
    if (simular && codigo !== simular.codigoValido) {
      setCodigoMalo(true);
      setIntentoCodigo((k) => k + 1);
      return;
    }
    const destino = simular?.destinoValido ?? destinoCodigo.replace('{codigo}', codigo);
    window.location.assign(destino);
  };

  /** "Volver a la invitación": si llegaron desde la invitación, regresa a la pantalla de la que vinieron. */
  const volverAtras = (evento) => {
    try {
      if (document.referrer && new URL(document.referrer).origin === location.origin && history.length > 1) {
        evento.preventDefault();
        history.back();
      }
    } catch {
      /* referrer ilegible: sigue el enlace */
    }
  };

  const enPasos = vista === 'p0' || vista === 'p1' || vista === 'p2';
  const numeroPaso = vista === 'p0' ? 1 : vista === 'p1' ? 2 : 3;
  const avance = enPasos ? `p${numeroPaso}` : vista === 'hecho' ? 'p4' : 'oculto';

  // Sillitas del pase en computadora: se pintan de índigo cuando ya eligieron quiénes vienen.
  const ocupadasPase =
    vista === 'regreso' || vista === 'cerrada'
      ? ocupadasPrevias
      : (vista === 'p1' || vista === 'p2' || vista === 'hecho') && si
        ? n
        : 0;

  const lugaresTexto = plural(L, 'lugar', 'lugares');
  const confirmados = `${n} de ${lugaresTexto} ${n === 1 ? 'confirmado' : 'confirmados'}`;
  const previos = `${ocupadasPrevias} de ${lugaresTexto} ${ocupadasPrevias === 1 ? 'confirmado' : 'confirmados'}`;
  const tam = L >= 6 ? 'l6' : L === 5 ? 'l5' : 'l4';

  /* ─── Piezas ──────────────────────────────────────────────────────── */

  const sillas = (
    <div className={`confirmacion__sillas confirmacion__sillas--${tam}`} role="group" aria-label="Quiénes asistirán">
      {Array.from({ length: L }, (_, i) => {
        const ocupada = i < n;
        const antes = i < prev;
        const retraso = ocupada === antes ? 0 : (ocupada ? i - prev : prev - 1 - i) * CASCADA_S;
        return (
          <button
            key={i}
            type="button"
            className={`confirmacion__silla${ocupada ? ' is-on' : ''}`}
            style={{ '--dl': `${retraso.toFixed(2)}s` }}
            aria-pressed={ocupada}
            aria-label={`Lugar ${i + 1}`}
            onClick={() => tocarSilla(i)}
          >
            <DibujoSilla />
            <span className="confirmacion__etiqueta" aria-hidden="true">
              Lugar {i + 1}
            </span>
          </button>
        );
      })}
    </div>
  );

  const sillasFijas = (
    <div className={`confirmacion__sillas confirmacion__sillas--${tam} confirmacion__sillas--fijas`} role="img" aria-label={`${ocupadasPrevias} de ${lugaresTexto}`}>
      {Array.from({ length: L }, (_, i) => (
        <div key={i} className={`confirmacion__silla${i < ocupadasPrevias ? ' is-on' : ''}`} aria-hidden="true">
          <DibujoSilla />
          <span className="confirmacion__etiqueta">Lugar {i + 1}</span>
        </div>
      ))}
    </div>
  );

  const ceja = (texto, dorada = false, a = anim(0.05)) => (
    <p className={`confirmacion__ceja confirmacion__cel${dorada ? ' confirmacion__ceja--oro' : ''}`} {...a}>
      {texto}
    </p>
  );

  const espacio = <span className="confirmacion__espacio confirmacion__cel" aria-hidden="true" />;

  /** @param {string} texto @param {ReturnType<typeof anim>} a @param {string} [extra] */
  const pregunta = (texto, a, extra = '') => (
    <h1 className={`confirmacion__pregunta ${extra}`} ref={titulo} tabIndex={-1} {...a}>
      {texto}
    </h1>
  );

  /** @param {string} texto @param {ReturnType<typeof anim>} a */
  const ayuda = (texto, a) => (
    <p className="confirmacion__ayuda" {...a}>
      {texto}
    </p>
  );

  /* ─── Cada paso: cuerpo (arriba) y acciones (abajo) ───────────────── */

  /** @type {{ cuerpo: import('react').ReactNode, acciones: import('react').ReactNode, pie: 'limite' | 'gracias' | 'sin' , fondo?: import('react').ReactNode }} */
  let paso;
  const limitePie = (a, clave) => (
    <FechaLimite limite={limite} clave={clave} className="confirmacion__cel" {...a} />
  );

  if (vista === 'candado') {
    const casillas = Array.from({ length: CODIGO_LARGO }, (_, i) => (
      <span key={i} className={`confirmacion__casilla${i === codigo.length ? ' is-now' : ''}`}>
        {codigo[i] ?? ''}
      </span>
    ));
    paso = {
      pie: 'limite',
      cuerpo: (
        <>
          {ceja('Confirma tu asistencia', true)}
          {pregunta('¿Cuál es el código de tu invitación?', anim(0.15, 0.05))}
          {ayuda('Viene bajo el QR de tu invitación impresa o al final de nuestro mensaje de WhatsApp.', anim(0.25, 0.15))}
          {espacio}
          <div className="confirmacion__codigo-caja" {...anim(0.45, 0.25)}>
            <div
              ref={cajaCodigo}
              className={`confirmacion__codigo${codigoMalo ? ' is-bad' : ''}${intentoCodigo ? ' is-ahora' : ''}`}
            >
              <span className="confirmacion__codigo-grupo">{casillas.slice(0, 4)}</span>
              <span className="confirmacion__codigo-guion" aria-hidden="true" />
              <span className="confirmacion__codigo-grupo">{casillas.slice(4)}</span>
              <input
                ref={campoCodigo}
                className="confirmacion__codigo-input"
                name="codigo"
                aria-label="Código de tu invitación"
                aria-invalid={codigoMalo || undefined}
                aria-describedby={codigoMalo ? 'confirmacion-codigo-error' : undefined}
                inputMode="text"
                autoCapitalize="characters"
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                maxLength={9}
                value={codigo}
                onChange={(e) => {
                  setCodigo(limpiarCodigo(e.target.value));
                  setCodigoMalo(false);
                }}
              />
            </div>
            {codigoMalo && (
              <p className="confirmacion__alerta" role="alert" id="confirmacion-codigo-error">
                <Alerta />
                <span>No encontramos ese código. Revísalo: son 8 letras y números, como aparece bajo el QR.</span>
              </p>
            )}
          </div>
          {espacio}
        </>
      ),
      acciones: (
        <>
          <div className="confirmacion__botones" {...anim(null, 0.35)}>
            <Button type="submit" block disabled={codigo.length !== CODIGO_LARGO} {...anim(0.5)}>
              Entrar a mi invitación
            </Button>
            <p className="confirmacion__pide" {...anim(0.6)}>
              ¿No lo tienes?{' '}
              <a href={whatsapp} target="_blank" rel="noopener noreferrer">
                Pídenoslo por WhatsApp
              </a>
            </p>
          </div>
          {limitePie(anim(0.7))}
        </>
      ),
    };
  } else if (vista === 'p0') {
    paso = {
      pie: 'limite',
      cuerpo: (
        <>
          {ceja('Confirma tu asistencia', true)}
          <p className="confirmacion__familia confirmacion__familia--paso confirmacion__cel" {...anim(0.15)}>
            {familia}
          </p>
          {espacio}
          <div className="confirmacion__pase-col confirmacion__cel" {...anim(0.35)}>
            <Sillitas lugares={L} tam="paso" />
            <span className="confirmacion__etiqueta-pase">Válido para {plural(L, 'persona', 'personas')}</span>
          </div>
          {espacio}
        </>
      ),
      acciones: (
        <>
          {pregunta('¿Nos acompañarán?', anim(0.5, 0.05), 'confirmacion__pregunta--chica')}
          <div className="confirmacion__botones" {...anim(null, 0.15)}>
            <Button block onClick={() => { setSi(true); ir('p1'); }} {...anim(0.6)}>
              Sí, con mucho gusto
            </Button>
            <Button variant="secondary" block onClick={() => { setSi(false); ir('p2'); }} {...anim(0.7)}>
              No podremos asistir
            </Button>
          </div>
          {limitePie(anim(0.35))}
        </>
      ),
    };
  } else if (vista === 'p1') {
    paso = {
      pie: 'limite',
      cuerpo: (
        <>
          {ceja(familia)}
          {pregunta('¿Quiénes vendrán?', anim(0.15, 0.05))}
          {ayuda('Toca una silla por cada persona que asistirá.', anim(0.25, 0.15))}
          {espacio}
          <div className="confirmacion__bloque" {...anim(0.45, 0.25)}>
            {sillas}
          </div>
          <div className="confirmacion__cuenta" aria-live="polite" {...anim(0.55, 0.35)}>
            <span className="confirmacion__odometro" aria-hidden="true">
              {Array.from({ length: L + 1 }, (_, k) => (
                <span key={k} className={k === n ? 'on' : undefined}>
                  {k}
                </span>
              ))}
            </span>
            <span className="sr-only">{n}</span>
            <span className="confirmacion__etiqueta-cuenta">de {lugaresTexto}</span>
          </div>
          {espacio}
        </>
      ),
      acciones: (
        <>
          <div className="confirmacion__botones" {...anim(null, 0.45)}>
            <Button block disabled={n === 0} onClick={() => n > 0 && ir('p2')} {...anim(0.5)}>
              Continuar
            </Button>
          </div>
          {limitePie(anim(0.6))}
        </>
      ),
    };
  } else if (vista === 'p2') {
    paso = {
      pie: 'limite',
      cuerpo: (
        <>
          {ceja(familia)}
          {pregunta('Un mensaje para nosotros', anim(0.15, 0.05))}
          {ayuda('Opcional', anim(0.25, 0.15))}
          <textarea
            className={`confirmacion__campo${mensaje ? ' is-filled' : ''}`}
            name="message"
            aria-label="Un mensaje para nosotros (opcional)"
            placeholder="Escríbenos algo bonito…"
            maxLength={MENSAJE_MAX}
            value={mensaje}
            onChange={(e) => setMensaje(e.target.value)}
            {...anim(0.35, 0.25)}
          />
        </>
      ),
      acciones: (
        <>
          <div className="confirmacion__botones" {...anim(null, 0.35)}>
            {error && (
              <div className="confirmacion__aviso" role="alert" {...anim(0.5)}>
                <Alerta />
                <span>No pudimos guardar tu respuesta. Revisa tu conexión e inténtalo de nuevo; tu mensaje sigue aquí.</span>
              </div>
            )}
            <Button type="submit" block aria-busy={guardando || undefined} {...anim(error ? 0.6 : 0.5)}>
              {error ? 'Intentar de nuevo' : 'Confirmar asistencia'}
            </Button>
          </div>
          {limitePie(anim(error ? 0.7 : 0.6))}
        </>
      ),
    };
  } else if (vista === 'hecho') {
    paso = {
      pie: 'gracias',
      fondo: (
        <>
          <span className="confirmacion__resplandor" aria-hidden="true" />
          {si &&
            destellos.map(([xc, xp, d, s], i) => (
              <span
                key={i}
                className="confirmacion__destello"
                aria-hidden="true"
                style={{ '--xc': `${xc}%`, '--xp': `${xp}%`, '--d': `${d}s`, '--s': s }}
              />
            ))}
        </>
      ),
      cuerpo: (
        <>
          <div {...anim(0.05, 0.05)}>
            <h1 className={`confirmacion__gracias${si ? '' : ' confirmacion__gracias--larga'}`} ref={titulo} tabIndex={-1}>
              {si ? 'gracias' : 'los extrañaremos'}
            </h1>
          </div>
          <p className="confirmacion__texto" {...anim(0.15, 0.15)}>
            {si
              ? 'Recibimos tu confirmación. Nos hace muy felices compartir este día contigo.'
              : 'Gracias por avisarnos. Te tendremos presentes ese día.'}
          </p>
          {si && (
            <div className="confirmacion__resumen" {...anim(0.25, 0.25)}>
              <Sillitas lugares={L} ocupadas={n} tam="resumen" className="confirmacion__cel" />
              <span className="confirmacion__etiqueta-pase">{confirmados}</span>
            </div>
          )}
        </>
      ),
      acciones: (
        <>
          <p className="confirmacion__nota" {...anim(0.5, si ? 0.35 : 0.25)}>
            Si algo cambia, puedes modificar tu respuesta hasta el {limite.nota}.
          </p>
          <Button variant="link" className="confirmacion__cambiar" onClick={() => { setSi(true); ir('p0'); }} {...anim(0.6, si ? 0.45 : 0.35)}>
            Cambiar mi respuesta
          </Button>
        </>
      ),
    };
  } else if (vista === 'regreso') {
    paso = {
      pie: 'limite',
      cuerpo: (
        <>
          {ceja(familia)}
          {pregunta('Ya tenemos su respuesta', anim(0.15, 0.05))}
          {ayuda(`La recibimos el ${recibida}.`, anim(0.25, 0.15))}
          {espacio}
          <div className="confirmacion__bloque" {...anim(0.45, 0.25)}>
            {asistio ? (
              <>
                {sillasFijas}
                <p className="confirmacion__etiqueta-pase confirmacion__etiqueta-regreso">{previos}</p>
              </>
            ) : (
              <p className="confirmacion__etiqueta-pase confirmacion__etiqueta-regreso">Nos avisaron que no podrán acompañarnos</p>
            )}
            {respuesta?.mensaje && <p className="confirmacion__cita">“{respuesta.mensaje}”</p>}
          </div>
          {espacio}
        </>
      ),
      acciones: (
        <>
          <div className="confirmacion__botones" {...anim(null, 0.35)}>
            <Button block onClick={() => { setSi(true); setPrev(n); ir('p0'); }} {...anim(0.5)}>
              Cambiar mi respuesta
            </Button>
          </div>
          {limitePie(anim(0.6), 'Pueden cambiarla hasta el')}
        </>
      ),
    };
  } else {
    // Cerrada: después de la fecha límite, sin formulario.
    paso = {
      pie: 'sin',
      cuerpo: (
        <>
          {ceja(familia)}
          {pregunta('Las confirmaciones cerraron', anim(0.15, 0.15))}
          {ayuda(`Recibimos respuestas hasta el ${limite.frase}.`, anim(0.25, 0.25))}
          {espacio}
          <div className="confirmacion__bloque confirmacion__bloque--cerrada" {...anim(0.45)}>
            <Hoja limite={limite} className="confirmacion__hoja-grande" width={84} height={107} {...anim(null, 0.05)} />
            <div className="confirmacion__suma" {...anim(null, 0.35)}>
              {respuesta ? (
                <>
                  {respuesta.asiste && <Sillitas lugares={L} ocupadas={ocupadasPrevias} tam="resumen" />}
                  <span className="confirmacion__etiqueta-pase">
                    {respuesta.asiste ? `Su respuesta: ${ocupadasPrevias} de ${lugaresTexto}` : 'Su respuesta: no podrán acompañarnos'}
                  </span>
                </>
              ) : (
                <span className="confirmacion__etiqueta-pase">No recibimos su respuesta</span>
              )}
            </div>
          </div>
          {espacio}
        </>
      ),
      acciones: (
        <div className="confirmacion__botones" {...anim(null, 0.45)}>
          <Button href={whatsapp} block target="_blank" rel="noopener noreferrer" {...anim(0.5)}>
            Escríbenos por WhatsApp
          </Button>
          <p className="confirmacion__nota confirmacion__nota--cerrada" {...anim(0.6)}>
            Si algo cambió, con gusto lo vemos con ustedes.
          </p>
        </div>
      ),
    };
  }

  /* ─── Pantalla ────────────────────────────────────────────────────── */

  const enCandado = vista === 'candado';
  const claseLimitePase = vista === 'hecho' ? ' is-gone' : '';

  return (
    <form
      className={`confirmacion__tablero confirmacion--${vista}${si ? '' : ' confirmacion--no'}`}
      method="post"
      action={accion}
      onSubmit={enviar}
      noValidate
    >
      <input type="hidden" name="attending" value={si ? 'true' : 'false'} />
      <input type="hidden" name="guests" value={si ? n : 0} />

      <div className="confirmacion__barra">
        {vista === 'p1' || vista === 'p2' ? (
          <button type="button" className="confirmacion__volver" onClick={atras}>
            <Flecha />
            Atrás
          </button>
        ) : (
          <a className="confirmacion__volver" href={volver} onClick={volverAtras}>
            <Flecha />
            Volver a la invitación
          </a>
        )}
        {enPasos && (
          <span className="confirmacion__contador" aria-live="polite">
            <b>{numeroPaso}</b> de 3
          </span>
        )}
      </div>
      <div className={`confirmacion__avance confirmacion__avance--${avance}`} aria-hidden="true">
        <i />
      </div>

      <div className="confirmacion__main">
        {/* Computadora: el pase, fijo en todos los pasos (en el candado, los nombres y la fecha). */}
        <div className="confirmacion__pase confirmacion__pc">
          <p className="confirmacion__ceja confirmacion__ceja--oro" {...anim(null, 0.05)}>
            Confirma tu asistencia
          </p>
          {enCandado ? (
            <>
              <p className="confirmacion__nombres" {...anim(null, 0.15)}>
                {novios.el}{' '}
                <i>&amp;</i>{' '}
                {novios.ella}
              </p>
              <p className="confirmacion__ayuda confirmacion__fecha-boda" {...anim(null, 0.25)}>
                {novios.fecha}
              </p>
            </>
          ) : (
            <>
              <p className="confirmacion__familia" {...anim(null, 0.15)}>
                {familia}
              </p>
              <div className="confirmacion__pase-sillas" {...anim(null, 0.25)}>
                <Sillitas lugares={L} ocupadas={ocupadasPase} tam="pase" />
                <span className="confirmacion__etiqueta-pase">Válido para {plural(L, 'persona', 'personas')}</span>
              </div>
            </>
          )}
          {vista !== 'cerrada' && (
            <div className={`confirmacion__pase-limite${claseLimitePase}`} aria-hidden={vista === 'hecho' || undefined} {...anim(null, 0.35)}>
              <FechaLimite limite={limite} clave={vista === 'regreso' ? 'Pueden cambiarla hasta el' : undefined} />
            </div>
          )}
        </div>
        <span className="confirmacion__filete confirmacion__pc" aria-hidden="true" />

        <div className={`confirmacion__paso confirmacion__paso--${paso.pie}`} key={`${vista}-${si}`}>
          {paso.fondo}
          <div className="confirmacion__columna">
            <div className="confirmacion__cuerpo">{paso.cuerpo}</div>
            <div className="confirmacion__acciones">{paso.acciones}</div>
          </div>
        </div>
      </div>
    </form>
  );
}
