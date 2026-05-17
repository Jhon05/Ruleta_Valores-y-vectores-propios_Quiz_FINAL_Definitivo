const QUESTION_BANK = [
  {
    id:'EV3_MCQ_01', topic:'EV', difficulty:3, kind:'mcq', title:'Valores propios por invariantes',
    prompt:String.raw`Determine los valores propios de
\[
A=\begin{pmatrix}4&1\\2&3\end{pmatrix}.
\]
Use el polinomio característico y seleccione la opción correcta.`,
    options:[
      String.raw`\(\lambda_1=5,\;\lambda_2=2\)`,
      String.raw`\(\lambda_1=4,\;\lambda_2=3\)`,
      String.raw`\(\lambda_1=6,\;\lambda_2=1\)`,
      String.raw`\(\lambda_1=7,\;\lambda_2=0\)`,
      String.raw`\(\lambda_1=5,\;\lambda_2=-2\)`,
      String.raw`\(\lambda_1=2\pm i\)`],
    answer:0,
    feedback:String.raw`Como \(\operatorname{tr}(A)=7\) y \(\det(A)=10\),
\[
p_A(\lambda)=\lambda^2-7\lambda+10=(\lambda-5)(\lambda-2).
\]
Por tanto, los valores propios son \(5\) y \(2\).`
  },
  {
    id:'EV4_TF_01', topic:'EV', difficulty:4, kind:'tf', title:'Discriminante y valores reales',
    prompt:String.raw`Decida si la afirmación es verdadera o falsa.
\[
A=\begin{pmatrix}2&-5\\1&-2\end{pmatrix}
\]
no tiene valores propios reales.`,
    options:['Verdadero','Falso'], answer:0,
    feedback:String.raw`Se tiene \(\operatorname{tr}(A)=0\) y \(\det(A)=1\). Entonces
\[
p_A(\lambda)=\lambda^2+1,
\]
por lo que los valores propios son \(\lambda=\pm i\). No hay valores propios reales.`
  },
  {
    id:'EV5_NUM_01', topic:'EV', difficulty:5, kind:'numeric', title:'Valor propio dominante',
    prompt:String.raw`Para
\[
A=\begin{pmatrix}6&2\\2&3\end{pmatrix},
\]
escriba el valor propio mayor.`,
    answer:7,
    feedback:String.raw`La traza es \(9\) y el determinante es \(14\). Luego
\[
p_A(\lambda)=\lambda^2-9\lambda+14=(\lambda-7)(\lambda-2).
\]
El valor propio mayor es \(7\).`
  },
  {
    id:'EV4_ST_01', topic:'EV', difficulty:4, kind:'statements', title:'Afirmaciones sobre espectro',
    prompt:String.raw`Para
\[
A=\begin{pmatrix}1&4\\2&3\end{pmatrix},
\]
considere las afirmaciones:
\[
\begin{array}{ll}
\text{I.} & 5 \text{ es valor propio de } A.\\
\text{II.} & \det(A)=5.\\
\text{III.} & \binom{1}{1} \text{ es vector propio asociado a } 5.\\
\text{IV.} & A \text{ es diagonalizable sobre } \mathbb R.
\end{array}
\]
¿Cuáles son verdaderas?`,
    options:['Solo I','I y II','I, III y IV','II y III','I, II y IV','Todas'], answer:2,
    feedback:String.raw`La traza es \(4\) y \(\det(A)=-5\). Entonces
\[
p_A(\lambda)=\lambda^2-4\lambda-5=(\lambda-5)(\lambda+1).
\]
Además, \(A(1,1)^T=(5,5)^T\). Hay dos valores propios reales distintos, luego es diagonalizable. Son verdaderas I, III y IV.`
  },

  {
    id:'DG3_MCQ_01', topic:'DG', difficulty:3, kind:'mcq', title:'Diagonalización explícita en dimensión dos',
    prompt:String.raw`Para
\[
A=\begin{pmatrix}3&1\\0&2\end{pmatrix},
\]
seleccione una diagonalización correcta \(A=PDP^{-1}\).`,
    options:[
      String.raw`\(P=\begin{pmatrix}1&-1\\0&1\end{pmatrix},\quad D=\begin{pmatrix}3&0\\0&2\end{pmatrix}\)`,
      String.raw`\(P=\begin{pmatrix}1&1\\0&1\end{pmatrix},\quad D=\begin{pmatrix}2&0\\0&3\end{pmatrix}\)`,
      String.raw`\(P=I,\quad D=A\)`,
      String.raw`\(P=\begin{pmatrix}0&1\\1&0\end{pmatrix},\quad D=\begin{pmatrix}3&1\\0&2\end{pmatrix}\)`,
      String.raw`\(P=\begin{pmatrix}1&0\\1&1\end{pmatrix},\quad D=\begin{pmatrix}3&0\\0&3\end{pmatrix}\)`,
      String.raw`\(A\) no es diagonalizable sobre \(\mathbb R\)`],
    answer:0,
    feedback:String.raw`Para \(\lambda=3\), sirve \((1,0)^T\). Para \(\lambda=2\), se resuelve
\[
(A-2I)v=0\quad\Rightarrow\quad x+y=0,
\]
por lo que sirve \((-1,1)^T\). Así,
\[
P=\begin{pmatrix}1&-1\\0&1\end{pmatrix},\qquad D=\operatorname{diag}(3,2).
\]`
  },
  {
    id:'DG4_ST_01', topic:'DG', difficulty:4, kind:'statements', title:'Diagonalización y multiplicidad geométrica',
    prompt:String.raw`Sea
\[
A=\begin{pmatrix}2&1\\0&2\end{pmatrix}.
\]
Analice:
\[
\begin{array}{ll}
\text{I.} & p_A(\lambda)=(\lambda-2)^2.\\
\text{II.} & \dim E_2=2.\\
\text{III.} & A \text{ tiene forma de Jordan no diagonal.}\\
\text{IV.} & A \text{ es diagonalizable sobre } \mathbb R.
\end{array}
\]`,
    options:['Solo I','I y II','I y III','II y IV','I, III y IV','Todas'], answer:2,
    feedback:String.raw`La matriz tiene único valor propio \(2\), pero
\[
A-2I=\begin{pmatrix}0&1\\0&0\end{pmatrix},
\]
de modo que el espacio propio tiene dimensión \(1\). Por tanto, I y III son verdaderas, II y IV son falsas.`
  },
  {
    id:'DG5_NUM_01', topic:'DG', difficulty:5, kind:'numeric', title:'Determinante de una matriz de cambio',
    prompt:String.raw`Para
\[
A=\begin{pmatrix}1&0\\3&4\end{pmatrix},
\]
tome una base propia en el orden \(\lambda_1=1\), \(\lambda_2=4\):
\[
v_1=\binom{1}{-1},\qquad v_2=\binom{0}{1}.
\]
Si \(P=(v_1\;v_2)\), escriba \(\det(P)\).`,
    answer:1,
    feedback:String.raw`Se tiene
\[
P=\begin{pmatrix}1&0\\-1&1\end{pmatrix},
\qquad
\det(P)=1\cdot 1-0\cdot(-1)=1.
\]`
  },
  {
    id:'DG4_TF_01', topic:'DG', difficulty:4, kind:'tf', title:'Criterio por valores propios distintos',
    prompt:String.raw`Toda matriz real \(2\times2\) con dos valores propios reales distintos es diagonalizable sobre \(\mathbb R\).`,
    options:['Verdadero','Falso'], answer:0,
    feedback:String.raw`Dos valores propios distintos producen dos espacios propios linealmente independientes. En dimensión dos eso da una base de vectores propios.`
  },

  {
    id:'OR3_MCQ_01', topic:'OR', difficulty:3, kind:'mcq', title:'Diagonalización ortogonal básica',
    prompt:String.raw`La matriz simétrica
\[
M=\begin{pmatrix}5&2\\2&5\end{pmatrix}
\]
se diagonaliza ortogonalmente. ¿Qué diagonal puede obtenerse?`,
    options:[
      String.raw`\(Q^TMQ=\begin{pmatrix}7&0\\0&3\end{pmatrix}\)`,
      String.raw`\(Q^TMQ=\begin{pmatrix}5&0\\0&5\end{pmatrix}\)`,
      String.raw`\(Q^TMQ=\begin{pmatrix}2&0\\0&5\end{pmatrix}\)`,
      String.raw`\(Q^TMQ=\begin{pmatrix}9&0\\0&1\end{pmatrix}\)`,
      String.raw`\(Q^TMQ=\begin{pmatrix}-7&0\\0&-3\end{pmatrix}\)`,
      'No admite diagonalización ortogonal'],
    answer:0,
    feedback:String.raw`Como
\[
\det(M-\lambda I)=(5-\lambda)^2-4,
\]
los valores propios son \(7\) y \(3\). Al ser simétrica, \(M\) admite diagonalización ortogonal.`
  },
  {
    id:'OR4_NUM_01', topic:'OR', difficulty:4, kind:'numeric', title:'Valor propio positivo de una matriz simétrica',
    prompt:String.raw`Para
\[
M=\begin{pmatrix}4&3\\3&-4\end{pmatrix},
\]
escriba el valor propio positivo.`,
    answer:5,
    feedback:String.raw`La traza es \(0\) y el determinante es \(-25\). Luego
\[
p_M(\lambda)=\lambda^2-25,
\]
y los valores propios son \(5\) y \(-5\).`
  },
  {
    id:'OR5_ST_01', topic:'OR', difficulty:5, kind:'statements', title:'Base ortonormal y diagonal',
    prompt:String.raw`Para
\[
M=\begin{pmatrix}2&1\\1&2\end{pmatrix},
\]
analice:
\[
\begin{array}{ll}
\text{I.} & \frac1{\sqrt2}\binom{1}{1}\text{ es vector propio para }3.\\
\text{II.} & \frac1{\sqrt2}\binom{1}{-1}\text{ es vector propio para }1.\\
\text{III.} & \operatorname{tr}(M)=4.\\
\text{IV.} & \det(M)=3.
\end{array}
\]`,
    options:['Solo I y II','Solo I, II y III','Solo II y IV','I, II, III y IV','Solo III y IV','Ninguna'], answer:3,
    feedback:String.raw`Los valores propios son \(3\) y \(1\), con direcciones \((1,1)^T\) y \((1,-1)^T\). Además, \(\operatorname{tr}(M)=4\) y \(\det(M)=3\). Todas son verdaderas.`
  },
  {
    id:'OR5_TF_01', topic:'OR', difficulty:5, kind:'tf', title:'Ortogonalidad de vectores propios',
    prompt:String.raw`Si \(M\) es una matriz simétrica real y \(u,v\) son vectores propios asociados a valores propios distintos, entonces \(u\perp v\).`,
    options:['Verdadero','Falso'], answer:0,
    feedback:String.raw`Para matrices simétricas reales, el teorema espectral garantiza que los espacios propios asociados a valores propios distintos son ortogonales.`
  },

  {
    id:'CQ3_MCQ_01', topic:'CQ', difficulty:3, kind:'mcq', title:'Matriz de la forma cuadrática',
    prompt:String.raw`La parte cuadrática
\[
9x^2-12xy+4y^2
\]
se escribe como \(X^TMX\), con \(X=(x,y)^T\). Seleccione \(M\).`,
    options:[
      String.raw`\(\begin{pmatrix}9&-6\\-6&4\end{pmatrix}\)`,
      String.raw`\(\begin{pmatrix}9&-12\\-12&4\end{pmatrix}\)`,
      String.raw`\(\begin{pmatrix}9&6\\6&4\end{pmatrix}\)`,
      String.raw`\(\begin{pmatrix}4&-6\\-6&9\end{pmatrix}\)`,
      String.raw`\(\begin{pmatrix}9&0\\-12&4\end{pmatrix}\)`,
      String.raw`\(\begin{pmatrix}-6&9\\4&-6\end{pmatrix}\)`],
    answer:0,
    feedback:String.raw`En \(X^TMX=m_{11}x^2+2m_{12}xy+m_{22}y^2\). Por eso \(2m_{12}=-12\), luego \(m_{12}=-6\).`
  },
  {
    id:'CQ4_NUM_01', topic:'CQ', difficulty:4, kind:'numeric', title:'Eje principal menor',
    prompt:String.raw`La forma cuadrática
\[
5x^2+6xy+5y^2
\]
tiene matriz asociada
\[
M=\begin{pmatrix}5&3\\3&5\end{pmatrix}.
\]
Escriba el menor valor propio de \(M\).`,
    answer:2,
    feedback:String.raw`Los valores propios de \(\begin{pmatrix}a&b\\b&a\end{pmatrix}\) son \(a+b\) y \(a-b\). Aquí son \(8\) y \(2\). El menor es \(2\).`
  },
  {
    id:'CQ5_ST_01', topic:'CQ', difficulty:5, kind:'statements', title:'Tipo de cónica por la matriz cuadrática',
    prompt:String.raw`Considere la cónica
\[
3x^2+4xy+3y^2=1.
\]
Sea \(M\) la matriz simétrica de su parte cuadrática. Analice:
\[
\begin{array}{ll}
\text{I.} & M=\begin{pmatrix}3&2\\2&3\end{pmatrix}.\\
\text{II.} & Los valores propios de M son 5 y 1.\\
\text{III.} & Es una elipse.\\
\text{IV.} & Una rotación ortogonal elimina el término xy.
\end{array}
\]`,
    options:['Solo I y II','Solo II y III','I, II, III y IV','Solo I, III y IV','Solo IV','Ninguna'], answer:2,
    feedback:String.raw`La matriz es \(M=\begin{pmatrix}3&2\\2&3\end{pmatrix}\), con valores propios \(5\) y \(1\). Ambos son positivos; por tanto la cónica es una elipse. El teorema espectral permite eliminar \(xy\) por rotación ortogonal.`
  },
  {
    id:'CQ4_TF_01', topic:'CQ', difficulty:4, kind:'tf', title:'Coeficiente mixto',
    prompt:String.raw`En la matriz simétrica asociada a \(ax^2+bxy+cy^2\), la entrada \(m_{12}\) es igual a \(b\).`,
    options:['Verdadero','Falso'], answer:1,
    feedback:String.raw`Es falso. En \(X^TMX\), el término mixto es \(2m_{12}xy\). Por tanto \(m_{12}=b/2\).`
  },

  {
    id:'RT3_MCQ_01', topic:'RT', difficulty:3, kind:'mcq', title:'Rotación que elimina el término mixto',
    prompt:String.raw`La forma
\[
3x^2+4xy+3y^2
\]
tiene matriz \(M=\begin{pmatrix}3&2\\2&3\end{pmatrix}\). ¿Qué dirección corresponde al valor propio mayor?`,
    options:[
      String.raw`\(\frac1{\sqrt2}\binom{1}{1}\)`,
      String.raw`\(\frac1{\sqrt2}\binom{1}{-1}\)`,
      String.raw`\(\binom{1}{0}\)`,
      String.raw`\(\binom{0}{1}\)`,
      String.raw`\(\frac1{\sqrt5}\binom{1}{2}\)`,
      'No existe dirección propia real'],
    answer:0,
    feedback:String.raw`Para matrices \(\begin{pmatrix}a&b\\b&a\end{pmatrix}\), el vector \((1,1)^T\) corresponde a \(a+b\). Aquí el valor mayor es \(5\), asociado a \((1,1)^T\).`
  },
  {
    id:'RT4_NUM_01', topic:'RT', difficulty:4, kind:'numeric', title:'Valor propio nulo en rotación',
    prompt:String.raw`Para la parte cuadrática
\[
9x^2-12xy+4y^2,
\]
la matriz asociada es
\[
M=\begin{pmatrix}9&-6\\-6&4\end{pmatrix}.
\]
Escriba el menor valor propio de \(M\).`,
    answer:0,
    feedback:String.raw`La traza es \(13\) y el determinante es \(9\cdot4-36=0\). Por tanto los valores propios son \(13\) y \(0\).`
  },
  {
    id:'RT5_ST_01', topic:'RT', difficulty:5, kind:'statements', title:'Rototraslación y signo de valores propios',
    prompt:String.raw`Considere
\[
x^2+4xy+y^2=1.
\]
Analice:
\[
\begin{array}{ll}
\text{I.} & M=\begin{pmatrix}1&2\\2&1\end{pmatrix}.\\
\text{II.} & Los valores propios son 3 y -1.\\
\text{III.} & La cónica es de tipo hiperbólico.\\
\text{IV.} & \det(M)>0.
\end{array}
\]`,
    options:['I, II y III','Solo I y IV','Solo II y IV','I, III y IV','Todas','Ninguna'], answer:0,
    feedback:String.raw`La matriz es correcta y sus valores propios son \(1+2=3\) y \(1-2=-1\). Como tienen signos opuestos, la cónica es hiperbólica. Además, \(\det(M)=-3<0\), de modo que IV es falsa.`
  },
  {
    id:'RT5_TF_01', topic:'RT', difficulty:5, kind:'tf', title:'Rotación y traslación',
    prompt:String.raw`Una rotación ortogonal siempre elimina los términos lineales de una cónica.`,
    options:['Verdadero','Falso'], answer:1,
    feedback:String.raw`La rotación elimina el término mixto de la parte cuadrática, pero los términos lineales se tratan mediante una traslación o completación de cuadrados.`
  },

  {
    id:'JC3_MCQ_01', topic:'JC', difficulty:3, kind:'mcq', title:'Bloque de Jordan básico',
    prompt:String.raw`Para
\[
A=\begin{pmatrix}2&1\\0&2\end{pmatrix},
\]
seleccione la afirmación correcta.`,
    options:['A es diagonal con dos valores propios distintos', 'A es un bloque de Jordan asociado a \(\lambda=2\)', 'A tiene valores propios \(1\) y \(2\)', 'A es ortogonal', 'A es simétrica', 'A tiene determinante \(0\)'], answer:1,
    feedback:String.raw`La matriz es de la forma \(J=2I+N\), donde \(N=\begin{pmatrix}0&1\\0&0\end{pmatrix}\) y \(N^2=0\). Es un bloque de Jordan no diagonal.`
  },
  {
    id:'JC4_NUM_01', topic:'JC', difficulty:4, kind:'numeric', title:'Potencia de un bloque de Jordan',
    prompt:String.raw`Sea
\[
J=\begin{pmatrix}3&1\\0&3\end{pmatrix}.
\]
Escriba la entrada \((1,2)\) de \(J^4\).`,
    answer:108,
    feedback:String.raw`Como \(J=3I+N\) y \(N^2=0\),
\[
J^4=3^4I+4\cdot3^3N.
\]
La entrada \((1,2)\) es \(4\cdot27=108\).`
  },
  {
    id:'JC5_ST_01', topic:'JC', difficulty:5, kind:'statements', title:'Estructura nilpotente',
    prompt:String.raw`Sea
\[
A=\begin{pmatrix}5&1\\0&5\end{pmatrix},\qquad N=A-5I.
\]
Analice:
\[
\begin{array}{ll}
\text{I.} & N^2=0.\\
\text{II.} & A^n=5^nI+n5^{n-1}N.\\
\text{III.} & \dim E_5=1.\\
\text{IV.} & A \text{ es diagonalizable.}
\end{array}
\]`,
    options:['I, II y III','Solo I y IV','Solo II y IV','I y II','Todas','Ninguna'], answer:0,
    feedback:String.raw`Aquí \(N=\begin{pmatrix}0&1\\0&0\end{pmatrix}\), luego \(N^2=0\). Por binomio, \((5I+N)^n=5^nI+n5^{n-1}N\). El espacio propio tiene dimensión \(1\); no es diagonalizable.`
  },
  {
    id:'JC5_TF_01', topic:'JC', difficulty:5, kind:'tf', title:'Polinomio característico repetido',
    prompt:String.raw`Si una matriz \(2\times2\) tiene polinomio característico \((\lambda-2)^2\), entonces necesariamente no es diagonalizable.`,
    options:['Verdadero','Falso'], answer:1,
    feedback:String.raw`Es falso. Por ejemplo, \(A=2I\) tiene polinomio característico \((\lambda-2)^2\) y sí es diagonalizable.`
  },

  {
    id:'CM3_MCQ_01', topic:'CM', difficulty:3, kind:'mcq', title:'Valores propios complejos',
    prompt:String.raw`Para
\[
A=\begin{pmatrix}0&-1\\1&0\end{pmatrix},
\]
seleccione sus valores propios.`,
    options:[String.raw`\(\lambda=\pm i\)`, String.raw`\(\lambda=\pm1\)`, String.raw`\(\lambda=0,1\)`, String.raw`\(\lambda=2\pm i\)`, String.raw`\(\lambda=-1,1\)`, 'No tiene valores propios sobre \(\mathbb C\)'], answer:0,
    feedback:String.raw`El polinomio característico es \(\lambda^2+1\). Por tanto \(\lambda=\pm i\).`
  },
  {
    id:'CM4_NUM_01', topic:'CM', difficulty:4, kind:'numeric', title:'Parte real del espectro complejo',
    prompt:String.raw`Para
\[
A=\begin{pmatrix}2&-5\\1&2\end{pmatrix},
\]
los valores propios son de la forma \(a\pm bi\). Escriba \(a\).`,
    answer:2,
    feedback:String.raw`La traza es \(4\), así que la parte real del par conjugado es \(\operatorname{tr}(A)/2=2\). De hecho, \(\lambda=2\pm \sqrt5 i\).`
  },
  {
    id:'CM5_ST_01', topic:'CM', difficulty:5, kind:'statements', title:'Diagonalización compleja de una matriz real',
    prompt:String.raw`Sea
\[
A=\begin{pmatrix}1&-4\\1&1\end{pmatrix}.
\]
Analice:
\[
\begin{array}{ll}
\text{I.} & \operatorname{tr}(A)=2.\\
\text{II.} & \det(A)=5.\\
\text{III.} & \lambda=1\pm2i.\\
\text{IV.} & A \text{ es diagonalizable sobre } \mathbb R.
\end{array}
\]`,
    options:['I, II y III','Solo I y IV','Solo II y III','I, III y IV','Todas','Ninguna'], answer:0,
    feedback:String.raw`El polinomio es \(\lambda^2-2\lambda+5\), por lo que \(\lambda=1\pm2i\). No es diagonalizable sobre \(\mathbb R\), aunque sí sobre \(\mathbb C\).`
  },
  {
    id:'CM4_TF_01', topic:'CM', difficulty:4, kind:'tf', title:'Discriminante negativo',
    prompt:String.raw`Una matriz real \(2\times2\) cuyo polinomio característico tiene discriminante negativo posee dos valores propios complejos conjugados.`,
    options:['Verdadero','Falso'], answer:0,
    feedback:String.raw`El polinomio característico tiene coeficientes reales. Si el discriminante es negativo, sus raíces son un par complejo conjugado.`
  },

  {
    id:'ST3_MCQ_01', topic:'ST', difficulty:3, kind:'mcq', title:'Dirección principal en covarianza',
    prompt:String.raw`La matriz de covarianza
\[
\Sigma=\begin{pmatrix}5&4\\4&5\end{pmatrix}
\]
tiene una dirección principal asociada al mayor valor propio. Selecciónela.`,
    options:[String.raw`\(\frac1{\sqrt2}\binom{1}{1}\)`, String.raw`\(\frac1{\sqrt2}\binom{1}{-1}\)`, String.raw`\(\binom{1}{0}\)`, String.raw`\(\binom{0}{1}\)`, String.raw`\(\frac1{\sqrt5}\binom{2}{1}\)`, 'No hay dirección principal'], answer:0,
    feedback:String.raw`Los valores propios son \(9\) y \(1\). El mayor, \(9\), corresponde a la dirección \((1,1)^T\).`
  },
  {
    id:'ST4_NUM_01', topic:'ST', difficulty:4, kind:'numeric', title:'Razón de varianzas principales',
    prompt:String.raw`Para
\[
\Sigma=\begin{pmatrix}10&6\\6&10\end{pmatrix},
\]
calcule la razón entre la mayor y la menor varianza principal.`,
    answer:4,
    feedback:String.raw`Los valores propios son \(10+6=16\) y \(10-6=4\). La razón es \(16/4=4\).`
  },
  {
    id:'ST5_ST_01', topic:'ST', difficulty:5, kind:'statements', title:'Interpretación geométrica de PCA',
    prompt:String.raw`Sea
\[
\Sigma=\begin{pmatrix}9&0\\0&1\end{pmatrix}.
\]
Analice:
\[
\begin{array}{ll}
\text{I.} & Los ejes principales coinciden con los ejes coordenados.\\
\text{II.} & Las desviaciones estándar principales son 3 y 1.\\
\text{III.} & La varianza total es 10.\\
\text{IV.} & \det(\Sigma)=9.
\end{array}
\]`,
    options:['Solo I y II','Solo II y III','I, II, III y IV','Solo I, III y IV','Solo IV','Ninguna'], answer:2,
    feedback:String.raw`La matriz ya es diagonal. Sus varianzas principales son \(9\) y \(1\), con desviaciones estándar \(3\) y \(1\). La traza es \(10\) y el determinante es \(9\).`
  },
  {
    id:'ST5_TF_01', topic:'ST', difficulty:5, kind:'tf', title:'Mayor valor propio y varianza',
    prompt:String.raw`En PCA, el mayor valor propio de la matriz de covarianza corresponde a la dirección de menor varianza.`,
    options:['Verdadero','Falso'], answer:1,
    feedback:String.raw`Es falso. El mayor valor propio corresponde a la dirección de mayor varianza principal.`
  }
];
