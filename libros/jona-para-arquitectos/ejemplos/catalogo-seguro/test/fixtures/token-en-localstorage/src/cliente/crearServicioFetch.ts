// Violación de la regla 2: el token de acceso se guarda donde cualquier script lo lee.
export async function entrar(email: string, clave: string) {
  const respuesta = await fetch('/api/sesion', { method: 'POST', body: JSON.stringify({ email, clave }) });
  const { token } = (await respuesta.json()) as { token: string };
  localStorage.setItem('token', token);
}
