import React from 'react';
import { Button } from '../components/Button';
import { Award, Download, Home } from 'lucide-react';

interface Props {
  userName: string;
  onBack: () => void;
}

export const Certificate: React.FC<Props> = ({ userName, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('es-EC', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
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
        <div className="max-w-4xl mx-auto">
          {/* Congratulations Card */}
          <div className="no-print mb-6 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl shadow-xl p-6 text-center">
            <div className="text-5xl mb-3">🎉</div>
            <h2 className="text-2xl font-black text-white mb-2">
              ¡FELICITACIONES!
            </h2>
            <p className="text-white text-sm">
              Has completado el entrenamiento <strong>BIOFIT EXPERT</strong>
            </p>
          </div>

          {/* Certificate */}
          <div 
            className="certificate-print bg-white rounded-xl shadow-2xl p-12 mb-6 border-4 border-[#00965E]"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-block p-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-4 shadow-lg">
                <Award size={48} className="text-white" />
              </div>
              <h1 className="text-4xl font-black text-[#00965E] mb-2">
                CERTIFICADO DE EXCELENCIA
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-[#00965E] to-yellow-500 mx-auto rounded-full"></div>
            </div>

            {/* Body */}
            <div className="text-center space-y-6 mb-8">
              <p className="text-lg text-gray-600">
                Se certifica que
              </p>
              
              <h2 className="text-4xl font-bold text-gray-900 py-4 border-b-2 border-t-2 border-[#00965E]">
                {userName}
              </h2>

              <p className="text-base text-gray-700 leading-relaxed max-w-2xl mx-auto">
                Ha completado exitosamente el programa <strong>BIOFIT EXPERT</strong>, 
                demostrando dominio en los beneficios, ventajas competitivas y 
                técnicas de venta de <strong className="text-[#00965E]">BIOFIT®</strong>.
              </p>

              <div className="bg-green-50 rounded-lg p-4 max-w-xl mx-auto border border-green-200">
                <p className="text-[#00965E] font-bold text-lg">
                  Embajador BIOFIT
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Capacitado para asesorar profesionalmente sobre salud digestiva y bienestar
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-between items-end mt-10 pt-6 border-t-2 border-gray-200">
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase">Fecha</p>
                <p className="font-semibold text-gray-900">{today}</p>
              </div>
              
              <div className="text-center">
                <div className="w-48 border-t-2 border-gray-700 pt-2">
                  <p className="text-sm font-bold text-gray-800">Firma Autorizada</p>
                  <p className="text-xs text-gray-600">PharmaBrand S.A.</p>
                </div>
              </div>

              <div className="text-right">
                <img 
                  src="/LOGO-BIOFIT-SIN-FONDO.png" 
                  alt="BIOFIT Logo" 
                  className="h-16"
                />
              </div>
            </div>

            {/* Brand Footer */}
            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-600">
                <strong className="text-[#00965E]">BIOFIT®</strong> es un producto de <strong>PharmaBrand S.A.</strong>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="no-print grid grid-cols-2 gap-4">
            <Button 
              onClick={handlePrint}
              className="flex items-center justify-center gap-2 bg-[#00965E] hover:bg-green-700 text-white py-4 text-base shadow-lg"
            >
              <Download size={20} />
              Descargar Certificado
            </Button>
            
            <Button 
              onClick={onBack}
              className="flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-4 text-base"
            >
              <Home size={20} />
              Volver al Inicio
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};
