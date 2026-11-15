// Violación: la molécula importa la vista del átomo por su ruta, sin pasar por su entrada.
import { JInputView } from '../../atomos/jinput/JInputView';

export const JFieldView = () => <JInputView value="" />;
