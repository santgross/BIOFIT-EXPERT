import React from 'react';
import { Button } from '../components/Button';
import { Award, Download } from 'lucide-react';

interface Props {
  userName: string;
  onBack: () => void;
}

export const Certificate: React.FC<Props> = ({ userName, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <>
      {/* Print Styles */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .certificate-print, .certificate-print * {
            visibility: visible;
          }
          .certificate-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4">
        <div className="max-w-5xl mx-auto">
          {/* Certificate */}
          <div 
            className="certificate-print bg-white rounded-2xl shadow-2xl p-16 mb-8 border-8 border-[#00965E]"
          >
            {/* Header */}
            <div className="text-center mb-12">
              <div className="inline-block p-6 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-6 shadow-xl">
                <Award size={80} className="text-white" />
              </div>
              <h1 className="text-6xl font-black text-[#00965E] mb-4 tracking-wide">
                CERTIFICADO DE EXCELENCIA
              </h1>
              <div className="w-40 h-1.5 bg-gradient-to-r from-[#00965E] via-yellow-500 to-[#00965E] mx-auto rounded-full"></div>
            </div>

            {/* Body */}
            <div className="text-center space-y-8 mb-12">
              <p className="text-2xl text-gray-700 font-light">
                Se certifica que
              </p>
              
              <h2 className="text-5xl font-bold text-gray-900 py-6 border-b-4 border-t-4 border-[#00965E] my-8">
                {userName}
              </h2>

              <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto font-light">
                Ha completado exitosamente el programa de entrenamiento <strong className="font-bold">BIOFIT EXPERT</strong>,
                demostrando excelencia en el conocimiento de los beneficios, ventajas competitivas
                y técnicas de venta del producto <strong className="font-bold text-[#00965E]">BIOFIT®</strong> - Fibra Natural de Psyllium Muciloide.
              </p>

              <p className="text-xl text-gray-700 leading-relaxed max-w-3xl mx-auto font-light">
                Este logro lo posiciona como <strong className="text-[#00965E] font-bold text-2xl">Embajador BIOFIT</strong>,
                con la capacidad de asesorar profesionalmente a pacientes sobre salud digestiva,
                control metabólico y bienestar general.
              </p>

              <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-xl p-6 max-w-2xl mx-auto border-2 border-green-200 my-8">
                <p className="text-lg text-gray-800 italic font-medium">
                  ¡Felicitaciones por tu dedicación y compromiso con la excelencia en el servicio farmacéutico!
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end mt-16 pt-8 border-t-2 border-gray-300">
              <div className="text-left">
                <p className="text-sm text-gray-500 uppercase tracking-wide">Fecha de emisión</p>
                <p className="font-bold text-gray-900 text-lg">{today}</p>
              </div>
              
              <div className="text-center">
                <div className="w-64 border-t-3 border-gray-800 pt-3">
                  <p className="text-base font-bold text-gray-800">Firma Autorizada</p>
                  <p className="text-sm text-gray-600 font-semibold">PharmaBrand S.A.</p>
                </div>
              </div>

              <div className="text-right">
                <img 
                  src="/LOGO-BIOFIT-SIN-FONDO.png" 
                  alt="BIOFIT Logo" 
                  className="h-20"
                />
              </div>
            </div>

            {/* Brand Footer */}
            <div className="text-center mt-12 pt-8 border-t-2 border-gray-200">
              <p className="text-base text-gray-600 font-semibold">
                BIOFIT® es un producto de <strong className="text-[#00965E]">PharmaBrand S.A.</strong>
              </p>
              <p className="text-sm text-gray-500 mt-2">
                Semillas de Psyllium Muciloide 47.70 g/100 g
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="no-print flex gap-4 justify-center">
            <Button 
              onClick={handlePrint}
              className="flex items-center gap-2 bg-gradient-to-r from-[#00965E] to-green-700 hover:from-green-700 hover:to-[#00965E] text-white px-8 py-4 text-lg shadow-xl transform hover:scale-105 transition-all"
            >
              <Download size={24} />
              Descargar/Imprimir Certificado
            </Button>
            
            <Button 
              onClick={onBack}
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-4 text-lg transform hover:scale-105 transition-all"
            >
              Volver al Inicio
            </Button>
          </div>

          {/* Congratulations Message */}
          <div className="no-print mt-8 bg-gradient-to-r from-yellow-50 via-green-50 to-yellow-50 rounded-xl p-8 text-center border-2 border-yellow-300 shadow-lg">
            <p className="text-2xl font-bold text-[#00965E] mb-3">
              🎉 ¡FELICITACIONES! 🎉
            </p>
            <p className="text-lg text-gray-700 leading-relaxed">
              Has completado todos los módulos de entrenamiento <strong>BIOFIT EXPERT</strong>.<br />
              Ahora estás preparado para ser un asesor de excelencia en tu farmacia.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};
