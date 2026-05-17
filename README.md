# Ruleta Lineal 5 · Nota 1.0 · Décimas · LaTeX

Juego web estático listo para GitHub Pages sobre álgebra lineal: valores y vectores propios, diagonalización, diagonalización ortogonal, cónicas en forma matricial, rototraslación, forma de Jordan 2x2, diagonalización compleja y ejes principales.

## Cambios finales

- El estudiante inicia con nota **1.0** y la meta es **5.0**.
- Antes de girar debe elegir una **ficha de ruleta**: rojo, negro, verde, par, impar, rangos o docenas.
- Luego elige cuántas **décimas académicas** arriesgar.
- Primero gira la ruleta y después se anima la caída de la pelota.
- Si acierta, gana exactamente las décimas elegidas.
- Si falla, pierde la mitad de lo elegido.
- Tipos de preguntas:
  - Verdadero/Falso.
  - Opción múltiple con 6 opciones.
  - Afirmaciones I, II, III y IV.
  - Respuesta numérica.
- Preguntas, opciones, pistas y retroalimentación en LaTeX con MathJax.
- Informe final descargable en HTML con preguntas, respuestas, retroalimentación y plan de mejora.

## Contraseñas

- Inicio: `LINEAL5`.
- Bloqueo: `LINEAL5`.
- Salida docente: hora militar del dispositivo.


## Versión con niveles por apuesta y cuadro de diálogo
- La partida inicia en nota 1.0 y la meta es 5.0.
- Antes de cada giro se abre un cuadro de diálogo para elegir ficha de ruleta y décimas académicas.
- Niveles automáticos por décimas: 0.1 básico, 0.2 intermedio, 0.3 a 0.5 avanzado, 0.7 a 1.0 experto.
- La ruleta fue compactada para permanecer visible en pantalla durante la partida.
- Si la respuesta es correcta, la nota aumenta el doble del valor elegido; si es incorrecta, baja solo la mitad.


## Corrección de seguridad y pantalla completa

- Contraseña de inicio: `LINEAL5`.
- La actividad intenta entrar en pantalla completa desde el primer gesto del usuario y la exige durante la partida.
- Para desbloquear infracciones o finalizar la partida se usa una clave docente dinámica: la hora militar actual del dispositivo, escrita en un campo oculto tipo contraseña.
- El reloj visible del juego se muestra en formato AM/PM.
- Se registran eventos de seguridad en el informe: salida de pantalla completa, cambio de ventana, cambio de pestaña, clic derecho, Escape, PrintScreen y atajos comunes de inspección/captura.


## Corrección de seguridad

- El reloj AM/PM permanece visible durante toda la actividad, incluidos bloqueos y validaciones docentes.
- Cada infracción de seguridad queda registrada como advertencia.
- Al completar 5 infracciones, el quiz se anula automáticamente con nota 0.0 y se descarga el informe.


## Corrección de puntuación agregada
- Si la ficha elegida coincide con la balota, se suma una bonificación probabilística: B(A) = 1-P(A), donde P es la probabilidad de acertar ese tipo de apuesta.
- Si la respuesta matemática es correcta, se suman 2 veces las décimas arriesgadas.
- Si la respuesta es incorrecta, se resta solo la mitad de las décimas arriesgadas.
- Se agregó un menú inicial de "Cómo jugar".


## Informe HTML con LaTeX

Al finalizar la partida, el juego descarga automáticamente un archivo `.html` con:

- portada tipo reporte académico;
- LaTeX renderizado con MathJax para preguntas, respuestas y retroalimentación;
- resumen de nota, aciertos, bonificación por ficha y movimiento de décimas;
- detalle de cada pregunta con pista, respuesta del estudiante y respuesta correcta;
- registro de seguridad e infracciones;
- botón para imprimir o guardar el informe como PDF desde el navegador.

Para que el LaTeX se vea correctamente en el informe HTML, abre el archivo con conexión a internet, pues MathJax se carga desde CDN.


## Corrección de validación de apuesta

Si el estudiante intenta cerrar el cuadro de apuesta o girar la ruleta sin haber elegido ficha de ruleta o décimas académicas, el sistema muestra un aviso dentro del juego. Este evento no se registra como infracción, no bloquea la partida y no incrementa el contador de seguridad.


## Corrección de apuesta actual y última balota

- Al guardar ficha y décimas, la interfaz muestra la **apuesta actual antes del giro** con ficha elegida, décimas, nivel y regla activa.
- Después de responder una pregunta, el panel muestra el **resultado de la última balota lanzada**, incluyendo balota, color, ficha elegida, resultado de la pregunta y movimiento total de la ronda.


## Corrección de bonificación probabilística

Si la balota cae en el tipo de ficha elegido, la bonificación ya no es fija. Ahora se calcula con:

```text
B = 1 - P(acertar la apuesta)
```

- Rojo, negro, par, impar, 1–18 o 19–36: P = 18/37 y B ≈ 0.51.
- Docenas: P = 12/37 y B ≈ 0.68.
- Verde 0: P = 1/37 y B ≈ 0.97.

El menú “Cómo jugar”, la apuesta actual, la retroalimentación y el informe HTML registran la probabilidad y el bono exacto de cada ronda.


## Corrección: menú Cómo jugar con LaTeX visible

El menú inicial ahora incluye una explicación detallada en LaTeX de la bonificación probabilística, con la fórmula \(B(A)=1-P(A)\), la probabilidad \(P(A)=|A|/37\), tabla por tipo de apuesta y ejemplo de ronda.

## Regla de cero real

No existe nota mínima de permanencia de 0.1. Si el estudiante pierde las décimas necesarias para continuar, o la nota llega a cero, el quiz termina automáticamente y la nota final queda en **0.0**.
