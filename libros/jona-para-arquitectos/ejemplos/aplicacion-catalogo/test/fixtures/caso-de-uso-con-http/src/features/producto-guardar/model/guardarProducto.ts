// Violación: el caso de uso habla HTTP; el puerto y su adaptador quedan de adorno.
import axios from 'axios';

export const guardarProducto = (datos: unknown) => axios.post('/productos', datos);
