import { IMAGE } from '../../tema/clasesToken.js';
import { JIMAGE_DEFAULTS, type InterJImage } from './InterJImage.js';

/** Vista: render puro. La prioridad decide la carga: eager y fetchpriority alta, o lazy. */
export function JImageView(props: InterJImage) {
  const { src, width, height, prioridad = JIMAGE_DEFAULTS.prioridad } = props;
  return (
    <img
      src={src}
      alt={props.decorativa ? '' : props.alt}
      width={width}
      height={height}
      loading={prioridad ? 'eager' : 'lazy'}
      fetchPriority={prioridad ? 'high' : undefined}
      className={IMAGE}
    />
  );
}
