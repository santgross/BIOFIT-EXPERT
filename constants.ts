import { Badge, MatchItem, QuestionTF, Scenario, TriviaQuestion } from "./types";

export const LOGO_URL = '/LOGO-BIOFIT-SIN-FONDO.png';

export const BRAND_COLORS = {
  primary: '#00965E',
  secondary: '#FFFFFF',
  accentRed: '#E11D48',
  accentOrange: '#F59E0B',
  accentBeige: '#F5F5DC',
  textDark: '#1F2937',
};

export const LEVEL_THRESHOLDS = {
  PRINCIPIANTE: 0,
  AVANZADO: 667,
  EXPERTO: 1334,
  MAESTRO: 2000,
};

export const BADGES: Badge[] = [
  { id: 'mes1', name: 'Asesor BIOFIT', description: 'Dominas los fundamentos del producto', icon: '🌱', requiredPoints: 200 },
  { id: 'mes3', name: 'Vendedor Experto', description: 'Manejas objeciones y técnicas de venta', icon: '🩺', requiredPoints: 600 },
  { id: 'mes6', name: 'Embajador BIOFIT', description: 'Eres un maestro en posicionamiento de marca', icon: '👑', requiredPoints: 1200 }
];

/* ========================================
   NIVEL 1 - FUNDAMENTOS DE VENTA
   ======================================== */

/* --- VERDADERO / FALSO NIVEL 1 --- */
const TF_LEVEL_1: QuestionTF[] = [
  { 
    id: 101, 
    statement: "BIOFIT tiene un PVP de $15.90, siendo más económico que la competencia.", 
    isTrue: true, 
    explanation: "CORRECTO. BIOFIT PVP $15.90 vs competencia (ejemplo: Metamucil ~$17.50). Argumento de venta: 'Mejor precio con mejor calidad'." 
  },
  { 
    id: 102, 
    statement: "BIOFIT viene en 3 sabores: Fresa, Original y Naranja.", 
    isTrue: true, 
    explanation: "CORRECTO. Esta variedad te permite ofrecer opciones según preferencia del cliente. '¿Qué sabor prefiere?'" 
  },
  { 
    id: 103, 
    statement: "BIOFIT tiene 98% de aceptación en disolución vs 47% de la competencia.", 
    isTrue: true, 
    explanation: "CORRECTO. Argumento clave: 'Se disuelve mejor, sin grumos. El cliente no abandona el tratamiento'." 
  },
  { 
    id: 104, 
    statement: "BIOFIT solo sirve para el estreñimiento.", 
    isTrue: false, 
    explanation: "FALSO. BIOFIT es MULTIFUNCIONAL: estreñimiento + colesterol + glucosa + saciedad. '4 beneficios en 1 producto'." 
  },
  { 
    id: 105, 
    statement: "BIOFIT es apto para diabéticos porque está endulzado con Sucralosa.", 
    isTrue: true, 
    explanation: "CORRECTO. Argumento de venta: 'Seguro para diabéticos, sin azúcar añadida'. Amplía tu mercado objetivo." 
  },
  { 
    id: 106, 
    statement: "Cada envase de BIOFIT contiene 300g y rinde aproximadamente 1 mes.", 
    isTrue: true, 
    explanation: "CORRECTO. Dosis: 1 cucharada 1-3 veces al día. Argumento: 'Mejor rendimiento que sachets de la competencia'." 
  }
];

/* --- VERDADERO / FALSO NIVEL 2 --- */
const TF_LEVEL_2: QuestionTF[] = [
  { 
    id: 201, 
    statement: "BIOFIT no solo alivia estreñimiento, también reduce el colesterol LDL.", 
    isTrue: true, 
    explanation: "CORRECTO. Estudios demuestran reducción del 6.7% de LDL. Argumento: 'Salud digestiva Y cardiovascular en un solo producto'." 
  },
  { 
    id: 202, 
    statement: "BIOFIT causa dependencia si se usa por más de 2 semanas.", 
    isTrue: false, 
    explanation: "FALSO. BIOFIT es fibra natural, NO laxante estimulante. Argumento: 'Uso diario seguro, sin dependencia'." 
  },
  { 
    id: 203, 
    statement: "El Psyllium de BIOFIT ayuda a controlar la glucosa en diabéticos.", 
    isTrue: true, 
    explanation: "CORRECTO. Ralentiza absorción de carbohidratos. Argumento: 'Ideal para pacientes diabéticos que buscan control natural'." 
  },
  { 
    id: 204, 
    statement: "BIOFIT tiene mejor textura que la competencia, evitando rechazo del paciente.", 
    isTrue: true, 
    explanation: "CORRECTO. 97% de aceptación sensorial. Argumento: 'Los pacientes no abandonan el tratamiento por mal sabor o textura'." 
  },
  { 
    id: 205, 
    statement: "BIOFIT prolonga la sensación de saciedad, ayudando al control de peso.", 
    isTrue: true, 
    explanation: "CORRECTO. Estudio Brum: saciedad hasta 4 horas. Argumento: 'Ayuda a controlar el apetito y el peso'." 
  },
  { 
    id: 206, 
    statement: "BIOFIT se debe tomar 2 horas antes o después de otros medicamentos.", 
    isTrue: true, 
    explanation: "CORRECTO. Evita interferencias en absorción. Consejo profesional que genera confianza con el cliente." 
  }
];

/* --- VERDADERO / FALSO NIVEL 3 --- */
const TF_LEVEL_3: QuestionTF[] = [
  { 
    id: 301, 
    statement: "BIOFIT es seguro durante el embarazo, pero siempre debe consultarse al médico.", 
    isTrue: true, 
    explanation: "CORRECTO. Es seguro pero recomendamos consulta. Posicionamiento ético: 'Cuidamos la salud de mamá y bebé'." 
  },
  { 
    id: 302, 
    statement: "BIOFIT tiene respaldo de estudios clínicos para colesterol (Anderson) y glucosa (Cicero).", 
    isTrue: true, 
    explanation: "CORRECTO. Argumento premium: 'No solo lo decimos nosotros, la ciencia lo respalda'." 
  },
  { 
    id: 303, 
    statement: "BIOFIT está contraindicado en adultos mayores por su textura.", 
    isTrue: false, 
    explanation: "FALSO. Su textura homogénea es IDEAL para adultos mayores. Argumento: 'Fácil de tragar, sin grumos'." 
  },
  { 
    id: 304, 
    statement: "BIOFIT puede recomendarse como complemento nutricional diario, no solo cuando hay problema.", 
    isTrue: true, 
    explanation: "CORRECTO. Prevención > Tratamiento. Argumento: 'Úselo diariamente para mantener la salud digestiva'." 
  },
  { 
    id: 305, 
    statement: "BIOFIT sustituye completamente los medicamentos para diabetes o colesterol.", 
    isTrue: false, 
    explanation: "FALSO. Es COADYUVANTE, no sustituto. Posicionamiento ético: 'Complementa, no reemplaza el tratamiento médico'." 
  },
  { 
    id: 306, 
    statement: "La disolución superior de BIOFIT mejora la adherencia del paciente al tratamiento.", 
    isTrue: true, 
    explanation: "CORRECTO. Menos abandono = más ventas recurrentes. Argumento: 'El cliente regresa porque sí funciona y es agradable'." 
  }
];

/* ========================================
   MATCHING GAMES - PROGRESIÓN INDEPENDIENTE
   ======================================== */

/* --- MATCH NIVEL 1: FUNDAMENTOS --- */
const MATCH_LEVEL_1: MatchItem[] = [
  { id: 'm1-1a', text: 'PVP BIOFIT', type: 'benefit', matchId: 'm1-1b' },
  { id: 'm1-1b', text: '$15.90', type: 'system', matchId: 'm1-1a' },
  { id: 'm1-2a', text: 'Sabores disponibles', type: 'benefit', matchId: 'm1-2b' },
  { id: 'm1-2b', text: 'Fresa, Original, Naranja', type: 'system', matchId: 'm1-2a' },
  { id: 'm1-3a', text: 'Contenido neto', type: 'benefit', matchId: 'm1-3b' },
  { id: 'm1-3b', text: '300g por envase', type: 'system', matchId: 'm1-3a' },
  { id: 'm1-4a', text: 'Ingrediente activo', type: 'benefit', matchId: 'm1-4b' },
  { id: 'm1-4b', text: 'Psyllium Muciloide 47.7g/100g', type: 'system', matchId: 'm1-4a' }
];

/* --- MATCH NIVEL 2: BENEFICIOS Y PERFILES --- */
const MATCH_LEVEL_2: MatchItem[] = [
  { id: 'm2-1a', text: 'Cliente con estreñimiento', type: 'benefit', matchId: 'm2-1b' },
  { id: 'm2-1b', text: 'Regula tránsito intestinal sin dependencia', type: 'system', matchId: 'm2-1a' },
  { id: 'm2-2a', text: 'Cliente diabético', type: 'benefit', matchId: 'm2-2b' },
  { id: 'm2-2b', text: 'Apto diabéticos + control glucémico', type: 'system', matchId: 'm2-2a' },
  { id: 'm2-3a', text: 'Cliente con colesterol alto', type: 'benefit', matchId: 'm2-3b' },
  { id: 'm2-3b', text: 'Reduce colesterol LDL 6.7%', type: 'system', matchId: 'm2-3a' },
  { id: 'm2-4a', text: 'Cliente que quiere bajar de peso', type: 'benefit', matchId: 'm2-4b' },
  { id: 'm2-4b', text: 'Sensación de saciedad prolongada', type: 'system', matchId: 'm2-4a' }
];

/* --- MATCH NIVEL 3: OBJECIONES Y TÉCNICAS --- */
const MATCH_LEVEL_3: MatchItem[] = [
  { id: 'm3-1a', text: 'Objeción: "Es muy caro"', type: 'benefit', matchId: 'm3-1b' },
  { id: 'm3-1b', text: 'Respuesta: Mejor precio y 4 beneficios en 1', type: 'system', matchId: 'm3-1a' },
  { id: 'm3-2a', text: 'Objeción: "No me gustan las fibras"', type: 'benefit', matchId: 'm3-2b' },
  { id: 'm3-2b', text: 'Respuesta: 97% aceptación, sin grumos', type: 'system', matchId: 'm3-2a' },
  { id: 'm3-3a', text: 'Objeción: "Ya probé otro y no funcionó"', type: 'benefit', matchId: 'm3-3b' },
  { id: 'm3-3b', text: 'Respuesta: Disolución 98% vs 47% otros', type: 'system', matchId: 'm3-3a' },
  { id: 'm3-4a', text: 'Objeción: "Causa dependencia"', type: 'benefit', matchId: 'm3-4b' },
  { id: 'm3-4b', text: 'Respuesta: Fibra natural, uso diario seguro', type: 'system', matchId: 'm3-4a' }
];

/* ========================================
   SCENARIOS - CASOS DE MOSTRADOR
   ======================================== */

/* --- SCENARIO NIVEL 1: CONSULTAS BÁSICAS DE PRODUCTO --- */
const SCENARIO_LEVEL_1: Scenario[] = [
  {
    id: 101,
    customer: "¿Cuánto cuesta BIOFIT? ¿Tienen promoción?",
    clerkResponse: "BIOFIT cuesta $15.90. Es el mejor precio del mercado comparado con otras fibras de Psyllium. Además, rinde más porque viene en 300g.",
    isCorrect: true,
    correctAction: "",
    feedback: "¡CORRECTO! Diste el precio exacto + argumento de valor (mejor precio + mayor rendimiento)."
  },
  {
    id: 102,
    customer: "¿En qué sabores viene? No me gusta lo muy dulce.",
    clerkResponse: "Viene en 3 sabores: Fresa, Naranja y Original. Si no le gusta lo dulce, le recomiendo el Original que tiene sabor neutro.",
    isCorrect: true,
    correctAction: "",
    feedback: "¡PERFECTO! Mostraste las opciones y recomendaste según la necesidad del cliente."
  },
  {
    id: 103,
    customer: "¿Para qué sirve BIOFIT exactamente?",
    clerkResponse: "BIOFIT es fibra natural de Psyllium que ayuda en 4 cosas: regula el estreñimiento, reduce el colesterol, controla la glucosa y da sensación de saciedad.",
    isCorrect: true,
    correctAction: "",
    feedback: "¡EXCELENTE! Destacaste los 4 beneficios principales. Cliente ve que es más que solo para estreñimiento."
  },
  {
    id: 104,
    customer: "¿Cómo se toma esto?",
    clerkResponse: "Es muy fácil: mezcla 1 cucharada en un vaso de agua o jugo, revuelve y tómalo inmediatamente. Puedes tomarlo de 1 a 3 veces al día.",
    isCorrect: true,
    correctAction: "",
    feedback: "¡MUY BIEN! Instrucciones claras y simples. Cliente sabe exactamente cómo usarlo."
  }
];

/* --- SCENARIO NIVEL 2: CONSULTAS BÁSICAS --- */
const SCENARIO_LEVEL_2: Scenario[] = [
  {
    id: 201,
    customer: "¿Cuál es el precio de BIOFIT? Veo que hay varios similares más baratos.",
    clerkResponse: "BIOFIT está en $15.90, y aunque hay opciones más económicas, BIOFIT le da 4 beneficios en 1: estreñimiento, colesterol, glucosa y saciedad. Es como comprar 4 productos en uno.",
    isCorrect: true,
    correctAction: "",
    feedback: "¡EXCELENTE! Transformaste objeción de precio en argumento de valor. Cliente entiende que NO es caro, es completo."
  },
  {
    id: 202,
    customer: "¿Qué sabor me recomienda? No me gustan las cosas muy dulces.",
    clerkResponse: "Tenemos 3 sabores: Fresa, Naranja y Original. El Original tiene sabor neutro, perfecto si prefiere algo sin dulce marcado. Los 3 se disuelven perfectamente sin grumos.",
    isCorrect: true,
    correctAction: "",
    feedback: "¡PERFECTO! Diste opciones + destacaste ventaja (sin grumos). Cliente siente que lo asesoraste bien."
  },
  {
    id: 203,
    customer: "¿Cuánto tiempo dura un envase? No quiero gastar mucho cada mes.",
    clerkResponse: "Un envase de 300g dura aproximadamente 1 mes con uso diario. Es más rendidor que los sachets de la competencia y mejor precio por gramo.",
    isCorrect: true,
    correctAction: "",
    feedback: "¡MUY BIEN! Diste información clara + comparaste con competencia. Argumento de economía a largo plazo."
  },
  {
    id: 204,
    customer: "Busco algo para mi mamá de 75 años. Le cuesta tragar pastillas y polvos.",
    clerkResponse: "BIOFIT es ideal para adultos mayores. Se disuelve completamente sin grumos, tiene textura suave y es fácil de tomar. Además, ayuda con el estreñimiento común en su edad.",
    isCorrect: true,
    correctAction: "",
    feedback: "¡EXCELENTE! Identificaste necesidad específica (textura) + beneficio adicional (estreñimiento en adultos mayores)."
  }
];

/* --- SCENARIO NIVEL 3: OBJECIONES Y CASOS ESPECIALES --- */
const SCENARIO_LEVEL_3: Scenario[] = [
  {
    id: 301,
    customer: "Soy diabético. ¿Este producto tiene azúcar? Ya me prohibieron muchas cosas.",
    clerkResponse: "¡Tranquilo! BIOFIT está endulzado con Sucralosa, es 100% seguro para diabéticos. Además, ayuda a controlar la glucosa porque ralentiza la absorción de carbohidratos.",
    isCorrect: true,
    correctAction: "",
    feedback: "¡PERFECTO! Tranquilizaste al cliente + diste beneficio adicional. Cliente ve que ENTIENDES su condición."
  },
  {
    id: 302,
    customer: "Ya compré Metamucil y no me gustó el sabor ni la textura. ¿Este es igual?",
    clerkResponse: "Justamente BIOFIT se diferencia por eso. Tiene 97% de aceptación en sabor y 98% en disolución, vs 47% de otros productos. Los clientes no abandonan el tratamiento porque SÍ es agradable.",
    isCorrect: true,
    correctAction: "",
    feedback: "¡EXCELENTE! Convertiste mala experiencia previa en oportunidad de venta. Usaste datos específicos (97%, 98%)."
  },
  {
    id: 303,
    customer: "Mi doctor me recetó una estatina para el colesterol. ¿BIOFIT la reemplaza?",
    clerkResponse: "BIOFIT NO reemplaza su medicamento, pero SÍ lo complementa. Puede reducir el colesterol LDL hasta 6.7% adicional de forma natural. Siempre mantenga su tratamiento médico.",
    isCorrect: true,
    correctAction: "",
    feedback: "¡PERFECTO! Posicionamiento ético correcto. Cliente confía en ti porque NO vendes milagros sino complemento real."
  },
  {
    id: 304,
    customer: "Estoy embarazada y con estreñimiento terrible. ¿Puedo tomar esto?",
    clerkResponse: "El Psyllium es fibra natural muy segura, pero en embarazo siempre es mejor que consulte con su ginecólogo primero. Mientras tanto, puede aumentar agua y alimentos con fibra.",
    isCorrect: true,
    correctAction: "",
    feedback: "¡EXCELENTE! Posicionamiento responsable. Cliente ve que priorizas su salud sobre la venta. Genera confianza."
  }
];

/* ========================================
   TRIVIA - CONOCIMIENTO RÁPIDO
   ======================================== */

/* --- TRIVIA NIVEL 1: CARACTERÍSTICAS --- */
const TRIVIA_LEVEL_1: TriviaQuestion[] = [
  { id: 401, question: "¿Cuántos sabores tiene BIOFIT?", options: ["1 sabor", "2 sabores", "3 sabores"], correctIndex: 2 },
  { id: 402, question: "¿Cuál es el PVP de BIOFIT?", options: ["$12.90", "$15.90", "$18.90"], correctIndex: 1 },
  { id: 403, question: "¿Qué porcentaje de Psyllium tiene cada 100g de BIOFIT?", options: ["30.5g", "47.7g", "60.2g"], correctIndex: 1 },
  { id: 404, question: "¿BIOFIT es apto para diabéticos?", options: ["No, tiene azúcar", "Sí, tiene Sucralosa", "Solo para diabéticos tipo 1"], correctIndex: 1 }
];

/* --- TRIVIA NIVEL 2: VENTAJAS COMPETITIVAS --- */
const TRIVIA_LEVEL_2: TriviaQuestion[] = [
  { id: 501, question: "¿Qué porcentaje de aceptación tiene BIOFIT en disolución?", options: ["47%", "80%", "98%"], correctIndex: 2 },
  { id: 502, question: "¿Cuántos beneficios ofrece BIOFIT?", options: ["1: solo estreñimiento", "2: estreñimiento y colesterol", "4: estreñimiento, colesterol, glucosa, saciedad"], correctIndex: 2 },
  { id: 503, question: "¿BIOFIT causa dependencia?", options: ["Sí, después de 2 semanas", "No, es fibra natural", "Solo en adultos mayores"], correctIndex: 1 },
  { id: 504, question: "¿Cuánto dura aproximadamente un envase de BIOFIT con uso diario?", options: ["2 semanas", "1 mes", "3 meses"], correctIndex: 1 }
];

/* --- TRIVIA NIVEL 3: CONOCIMIENTO AVANZADO --- */
const TRIVIA_LEVEL_3: TriviaQuestion[] = [
  { id: 601, question: "¿Cuánto reduce BIOFIT el colesterol LDL según estudios?", options: ["3.2%", "6.7%", "12.5%"], correctIndex: 1 },
  { id: 602, question: "¿Cuántas horas dura la sensación de saciedad con BIOFIT?", options: ["1 hora", "4 horas", "8 horas"], correctIndex: 1 },
  { id: 603, question: "¿Qué debe hacer un cliente que toma otros medicamentos?", options: ["Tomar todo junto", "Espaciar 2 horas antes/después", "Solo tomar BIOFIT"], correctIndex: 1 },
  { id: 604, question: "¿Por qué BIOFIT es mejor para adultos mayores?", options: ["Es más barato", "Textura sin grumos, fácil de tragar", "Tiene más sabor"], correctIndex: 1 }
];

/* ========================================
   EXPORT DATA
   ======================================== */

export const DATA_BY_LEVEL = {
  TF: { 1: TF_LEVEL_1, 2: TF_LEVEL_2, 3: TF_LEVEL_3 },
  MATCH: { 1: MATCH_LEVEL_1, 2: MATCH_LEVEL_2, 3: MATCH_LEVEL_3 },
  SCENARIO: { 1: SCENARIO_LEVEL_1, 2: SCENARIO_LEVEL_2, 3: SCENARIO_LEVEL_3 },
  TRIVIA: { 1: TRIVIA_LEVEL_1, 2: TRIVIA_LEVEL_2, 3: TRIVIA_LEVEL_3 }
};

export const GAME_IDS = {
  MATCH: {
    1: 'match-level-1',
    2: 'match-level-2',
    3: 'match-level-3'
  },
  SCENARIO: {
    1: 'scenario-level-1',
    2: 'scenario-level-2',
    3: 'scenario-level-3'
  },
  TRIVIA: {
    1: 'trivia-level-1',
    2: 'trivia-level-2',
    3: 'trivia-level-3'
  }
};
