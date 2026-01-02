
import { Badge, MatchItem, QuestionTF, Scenario, TriviaQuestion } from "./types";

export const LOGO_URL = "https://biofit.com.ec/wp-content/uploads/2021/06/logo-biofit-1.png";

export const BRAND_COLORS = {
  primary: '#00965E',
  secondary: '#FFFFFF',
  accentRed: '#E11D48',
  accentOrange: '#F59E0B',
  accentBeige: '#F5F5DC',
  textDark: '#1F2937',
};

export const LEVEL_THRESHOLDS = {
  PRINCIPIANTE: 0,      // Mes 1-2
  AVANZADO: 400,        // Mes 3-4
  EXPERTO: 800,         // Mes 5-6
  MAESTRO: 1200,        // Graduación
};

export const BADGES: Badge[] = [
  { id: 'mes1', name: 'Novato BIOFIT', description: 'Completaste tu primer mes de entrenamiento.', icon: '🌱', requiredPoints: 200 },
  { id: 'mes3', name: 'Asesor de Salud', description: 'Dominas los beneficios metabólicos (Diabetes/Colesterol).', icon: '🩺', requiredPoints: 600 },
  { id: 'mes6', name: 'Embajador PharmaBrand', description: 'Experto clínico en Psyllium Muciloide.', icon: '👑', requiredPoints: 1200 }
];

/* --- VERDADERO / FALSO --- */
const TF_LEVEL_1: QuestionTF[] = [
  { id: 101, statement: "BIOFIT tiene una disolución superior del 98% frente al 47% de la competencia.", isTrue: true, explanation: "Correcto. Su tecnología evita grumos y mejora la experiencia del paciente." },
  { id: 102, statement: "Cada 100g de BIOFIT contienen 47.7g de Psyllium Muciloide.", isTrue: true, explanation: "Correcto. Es una formulación de alta pureza." },
  { id: 103, statement: "El precio PVP de BIOFIT es de $18.50.", isTrue: false, explanation: "Falso. El PVP sugerido es de $15.90, siendo el más competitivo." },
  { id: 104, statement: "BIOFIT Original tiene el mismo éxito de sabor que el de Fresa.", isTrue: true, explanation: "Correcto. El 97% de evaluadores prefiere BIOFIT sobre otros Psyllium." },
  { id: 105, statement: "BIOFIT rinde menos que los sachets de la competencia.", isTrue: false, explanation: "Falso. Su presentación de 300g ofrece mayor rendimiento y mejor precio por gramo." }
];

const TF_LEVEL_2: QuestionTF[] = [
  { id: 201, statement: "La fibra insoluble es la que más aumenta la masa fecal por retener agua.", isTrue: true, explanation: "Correcto. Según la FEAD, la fibra insoluble incrementa el volumen de las heces." },
  { id: 202, statement: "Se recomienda consumir de 2 a 5 raciones de legumbres a la semana.", isTrue: true, explanation: "Correcto. Las legumbres son una fuente primordial de fibra." },
  { id: 203, statement: "BIOFIT solo debe usarse cuando ya hay estreñimiento severo.", isTrue: false, explanation: "Falso. BIOFIT también está indicado para la prevención y mejora de la salud digestiva general." },
  { id: 204, statement: "La práctica de yoga o carrera suave ayuda a reducir el tiempo de digestión.", isTrue: true, explanation: "Correcto. La actividad física es un pilar fundamental para el tránsito intestinal." }
];

const TF_LEVEL_3: QuestionTF[] = [
  { id: 301, statement: "El estudio de Anderson demostró que el Psyllium mejora los perfiles lipídicos séricos.", isTrue: true, explanation: "Correcto. Los niveles de LDL fueron 6.7% más bajos que con placebo." },
  { id: 302, statement: "BIOFIT puede causar dependencia intestinal si se usa más de 6 días.", isTrue: false, explanation: "Falso. BIOFIT no es un laxante estimulante; regula de forma natural sin causar dependencia." },
  { id: 303, statement: "El meta-análisis de 19 ensayos clínicos confirmó que el Psyllium reduce la HbA1c.", isTrue: true, explanation: "Correcto. Mejora significativamente el control glucémico en pacientes Tipo 2." },
  { id: 304, statement: "El Psyllium reduce el hambre en un 39% según el estudio de Brum.", isTrue: true, explanation: "Correcto. Aumenta la sensación de saciedad significativamente." }
];

/* --- MATCHING GAMES --- */
const MATCH_LEVEL_1: MatchItem[] = [
  { id: '1a', text: 'PVP BIOFIT', type: 'benefit', matchId: '1b' },
  { id: '1b', text: '$15.90', type: 'system', matchId: '1a' },
  { id: '2a', text: 'PVP Competencia (Rowe)', type: 'benefit', matchId: '2b' },
  { id: '2b', text: '$17.50', type: 'system', matchId: '2a' },
  { id: '3a', text: 'Aceptación Sabor', type: 'benefit', matchId: '3b' },
  { id: '3b', text: '97% de evaluadores', type: 'system', matchId: '3a' },
  { id: '4a', text: 'Disolución Superior', type: 'benefit', matchId: '4b' },
  { id: '4b', text: '98% de éxito', type: 'system', matchId: '4a' }
];

const MATCH_LEVEL_2: MatchItem[] = [
  { id: '5a', text: 'Frutas diarias', type: 'benefit', matchId: '5b' },
  { id: '5b', text: '3 piezas enteras', type: 'system', matchId: '5a' },
  { id: '6a', text: 'Verduras diarias', type: 'benefit', matchId: '6b' },
  { id: '6b', text: '2 raciones', type: 'system', matchId: '6a' },
  { id: '7a', text: 'Cereales diarios', type: 'benefit', matchId: '7b' },
  { id: '7b', text: '4 a 6 raciones', type: 'system', matchId: '7a' },
  { id: '8a', text: 'Hidratación', type: 'benefit', matchId: '8b' },
  { id: '8b', text: '1.5 a 2 litros', type: 'system', matchId: '8a' }
];

/* --- SCENARIOS (CASOS DE MOSTRADOR) --- */
const SCENARIO_LEVEL_2: Scenario[] = [
  {
    id: 201,
    customer: "¿BIOFIT tiene el mismo efecto si lo mezclo con jugo en lugar de agua?",
    clerkResponse: "Sí, puede mezclarlo con agua o jugos naturales, siempre bebiéndolo de inmediato para evitar que espese.",
    isCorrect: true,
    correctAction: "",
    feedback: "¡Correcto! BIOFIT es versátil en su administración."
  },
  {
    id: 202,
    customer: "Mi doctor me dijo que coma fibra pero me da muchos gases. ¿BIOFIT me hará lo mismo?",
    clerkResponse: "BIOFIT tiene una pureza y disolución superior que minimiza la fermentación excesiva y gases comparado con otras fibras.",
    isCorrect: true,
    correctAction: "",
    feedback: "Muy bien. La calidad del Psyllium influye directamente en la tolerancia."
  },
  {
    id: 203,
    customer: "¿BIOFIT sirve para limpiar el colon antes de una cirugía?",
    clerkResponse: "No, BIOFIT es para el manejo del estreñimiento y salud metabólica, no es un preparador quirúrgico fuerte.",
    isCorrect: true,
    correctAction: "",
    feedback: "Correcto. Hay que diferenciar entre suplementos de fibra y laxantes osmóticos de choque."
  },
  {
    id: 204,
    customer: "Busco algo para mi papá de 80 años, le cuesta mucho tragar polvos con grumos.",
    clerkResponse: "BIOFIT es ideal para él por su textura homogénea sin grumos, lo que facilita la deglución en adultos mayores.",
    isCorrect: true,
    correctAction: "",
    feedback: "¡Excelente punto de venta! La adherencia en adultos mayores depende de la textura."
  }
];

const SCENARIO_LEVEL_3: Scenario[] = [
  {
    id: 301,
    customer: "Estoy embarazada y tengo mucho estreñimiento. ¿Puedo tomar BIOFIT?",
    clerkResponse: "El Psyllium es de acción mecánica y segura, pero siempre consulte a su ginecólogo antes de iniciar cualquier producto.",
    isCorrect: true,
    correctAction: "",
    feedback: "Correcto. Aunque es seguro, el protocolo ético es referir a consulta profesional en embarazo."
  },
  {
    id: 302,
    customer: "¿Por qué el estudio de Anderson es importante para mi colesterol?",
    clerkResponse: "Porque demostró que BIOFIT reduce el LDL un 6.7% sin efectos secundarios, siendo un gran apoyo a su dieta.",
    isCorrect: true,
    correctAction: "",
    feedback: "¡Respuesta experta! Citar la evidencia clínica convence a pacientes informados."
  },
  {
    id: 303,
    customer: "Si tomo BIOFIT, ¿puedo dejar de tomar mi pastilla para la diabetes?",
    clerkResponse: "No, BIOFIT ayuda a controlar la glucosa (estudio Cicero), pero jamás debe suspender su tratamiento médico sin autorización del doctor.",
    isCorrect: true,
    correctAction: "",
    feedback: "Responsabilidad ante todo. BIOFIT es un coadyuvante, no un sustituto farmacológico."
  }
];

/* --- TRIVIA QUESTIONS --- */
const TRIVIA_LEVEL_1: TriviaQuestion[] = [
  { id: 11, question: "¿Cuál es la dosis recomendada para adultos?", options: ["1 cucharada 1 a 3 veces al día", "1 sachet a la semana", "Toda la lata en 3 días"], correctIndex: 0 },
  { id: 12, question: "¿Qué sucede si esperas mucho para tomar BIOFIT tras mezclarlo?", options: ["Se evapora", "Se vuelve una masa gelatinosa difícil de tragar", "Cambia de color a azul"], correctIndex: 1 },
  { id: 13, question: "BIOFIT es apto para diabéticos por ser endulzado con:", options: ["Miel", "Azúcar morena", "Sucralosa"], correctIndex: 2 },
  { id: 14, question: "¿En cuántos sabores viene BIOFIT?", options: ["1 (Original)", "2 (Fresa y Naranja)", "3 (Fresa, Naranja y Original)"], correctIndex: 2 }
];

const TRIVIA_LEVEL_2: TriviaQuestion[] = [
  { id: 21, question: "¿Qué beneficio extra ofrece la fibra insoluble según la FEAD?", options: ["Aumenta masa fecal y frecuencia", "Aclara la piel", "Quita el sueño"], correctIndex: 0 },
  { id: 22, question: "Para educar el intestino, se recomienda ir al baño:", options: ["Solo cuando haya urgencia", "A la misma hora todos los días", "Cada 3 días"], correctIndex: 1 },
  { id: 23, question: "¿Cuál es la postura recomendada para facilitar la deposición?", options: ["De pie", "Sentado normal", "Rodillas próximas al pecho (con banqueta)"], correctIndex: 2 },
  { id: 24, question: "Una ración individual de legumbres equivale a unos:", options: ["10 gramos", "60 gramos en crudo", "1 kilogramo"], correctIndex: 1 }
];

const TRIVIA_LEVEL_3: TriviaQuestion[] = [
  { id: 31, question: "En el estudio de Cicero, ¿cuánto bajó la glucemia en ayunas?", options: ["-2%", "-18%", "-50%"], correctIndex: 1 },
  { id: 32, question: "¿Qué porcentaje de reducción de insulina mostró el grupo Psyllium?", options: ["-17%", "-5%", "0%"], correctIndex: 0 },
  { id: 33, question: "¿Cuánto tiempo duró el estudio de Anderson para colesterol?", options: ["2 semanas", "1 mes", "26 semanas"], correctIndex: 2 },
  { id: 34, question: "Según el estudio de Brum, ¿cuántas horas dura la sensación de saciedad?", options: ["1 hora", "4 horas", "12 horas"], correctIndex: 1 }
];

export const DATA_BY_LEVEL = {
  TF: { 1: TF_LEVEL_1, 2: TF_LEVEL_2, 3: TF_LEVEL_3 },
  MATCH: { 1: MATCH_LEVEL_1, 2: MATCH_LEVEL_2, 3: [] },
  SCENARIO: { 1: [], 2: SCENARIO_LEVEL_2, 3: SCENARIO_LEVEL_3 },
  TRIVIA: { 1: TRIVIA_LEVEL_1, 2: TRIVIA_LEVEL_2, 3: TRIVIA_LEVEL_3 }
};
