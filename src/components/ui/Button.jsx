// Botón para islas de React: misma API y mismo estilo (styles/ui/button.css) que Button.astro.
// Con `href` se renderiza como enlace real (<a>); sin él, como <button>.
import '@/styles/ui/button.css';

/**
 * @param {Object} props
 * @param {'primary' | 'secondary' | 'link'} [props.variant]
 * @param {string} [props.href] si existe, se usa <a>
 * @param {boolean} [props.block] ocupa todo el ancho
 * @param {'button' | 'submit' | 'reset'} [props.type] sólo para <button>
 * @param {string} [props.className]
 * @param {import('react').ReactNode} [props.children]
 * @param {Record<string, unknown>} [props.rest]
 */
export default function Button({ variant = 'primary', href, block = false, type = 'button', className, children, ...rest }) {
  const clases = ['btn', `btn--${variant}`, block && 'btn--block', className].filter(Boolean).join(' ');
  if (href) {
    return (
      <a href={href} className={clases} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button type={type} className={clases} {...rest}>
      {children}
    </button>
  );
}
