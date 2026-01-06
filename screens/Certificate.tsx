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
        @page {
          size: landscape;
          margin: 0;
        }
        
        @media print {
          body * {
            visibility: hidden;
          }
          .certificate-print, .certificate-print * {
            visibility: visible;
          }
          .certificate-print {
            position: fixed;
            left: 0;
            top: 0;
            width: 100vw;
            height: 100vh;
            margin: 0;
            padding: 40px;
            page-break-after: avoid;
          }
          .no-print {
            display: none !important;
          }
        }
      `}</style>

      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
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

          {/* Certificate - Landscape Format */}
          <div 
            className="certificate-print bg-white rounded-xl shadow-2xl p-8 mb-6 border-4 border-[#00965E]"
            style={{ aspectRatio: '1.414/1' }}
          >
            {/* Logo Header */}
            <div className="flex justify-center mb-6">
              <img 
                src="/LOGO-BIOFIT-SIN-FONDO.png" 
                alt="BIOFIT Logo" 
                className="h-20"
              />
            </div>

            {/* Title with Icon */}
            <div className="text-center mb-6">
              <div className="inline-block p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-3 shadow-lg">
                <Award size={40} className="text-white" />
              </div>
              <h1 className="text-4xl font-black text-[#00965E] mb-2">
                CERTIFICADO DE EXCELENCIA
              </h1>
              <div className="w-32 h-1 bg-gradient-to-r from-[#00965E] to-yellow-500 mx-auto rounded-full"></div>
            </div>

            {/* Body */}
            <div className="text-center space-y-4 mb-6">
              <p className="text-base text-gray-600">
                Se certifica que
              </p>
              
              <h2 className="text-3xl font-bold text-gray-900 py-3 border-b-2 border-t-2 border-[#00965E] max-w-2xl mx-auto">
                {userName}
              </h2>

              <p className="text-sm text-gray-700 leading-relaxed max-w-3xl mx-auto px-8">
                Ha completado exitosamente el programa <strong>BIOFIT EXPERT</strong>, 
                demostrando dominio en los beneficios, ventajas competitivas y 
                técnicas de venta de <strong className="text-[#00965E]">BIOFIT®</strong>.
              </p>

              <div className="bg-green-50 rounded-lg p-3 max-w-2xl mx-auto border border-green-200">
                <p className="text-[#00965E] font-bold text-base">
                  Embajador BIOFIT
                </p>
                <p className="text-xs text-gray-600 mt-1">
                  Capacitado para asesorar profesionalmente sobre salud digestiva y bienestar
                </p>
              </div>
            </div>

            {/* Footer - Two columns */}
            <div className="grid grid-cols-2 gap-8 items-end mt-8 pt-6 border-t-2 border-gray-200 max-w-4xl mx-auto">
              {/* Left: Date */}
              <div className="text-left">
                <p className="text-xs text-gray-500 uppercase mb-1">Fecha de Emisión</p>
                <p className="font-semibold text-gray-900 text-sm">{today}</p>
              </div>
              
              {/* Right: Signature */}
              <div className="text-right">
                <div className="inline-block">
                  <div className="border-t-2 border-gray-700 pt-2 min-w-[200px]">
                    <p className="text-sm font-bold text-gray-800">Firma Autorizada</p>
                    <p className="text-xs text-gray-600">PharmaBrand S.A.</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Brand Footer */}
            <div className="text-center mt-6 pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600">
                <strong className="text-[#00965E]">BIOFIT®</strong> es un producto de <strong>PharmaBrand S.A.</strong>
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="no-print grid grid-cols-2 gap-4 max-w-2xl mx-auto">
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
