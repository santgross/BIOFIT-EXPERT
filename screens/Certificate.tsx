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
          size: A4 landscape;
          margin: 0;
        }
        
        @media print {
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          
          html, body {
            width: 297mm;
            height: 210mm;
            margin: 0;
            padding: 0;
            overflow: hidden;
          }
          
          body * {
            visibility: hidden;
          }
          
          .certificate-print-wrapper {
            visibility: visible;
            position: fixed;
            left: 0;
            top: 0;
            width: 297mm;
            height: 210mm;
            margin: 0;
            padding: 0;
            overflow: hidden;
            page-break-after: avoid;
            page-break-before: avoid;
            page-break-inside: avoid;
          }
          
          .certificate-print-wrapper * {
            visibility: visible;
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

          {/* Certificate Wrapper for Print */}
          <div className="certificate-print-wrapper">
            {/* Certificate - Landscape Format */}
            <div 
              className="bg-white shadow-2xl border-4 border-[#00965E] flex flex-col items-center justify-center"
              style={{ 
                width: '297mm', 
                height: '210mm',
                padding: '20mm',
                boxSizing: 'border-box'
              }}
            >
              {/* Logo Header */}
              <div className="mb-4">
                <img 
                  src="/LOGO-BIOFIT-SIN-FONDO.png" 
                  alt="BIOFIT Logo" 
                  style={{ height: '60px' }}
                />
              </div>

              {/* Title with Icon */}
              <div className="text-center mb-4">
                <div className="inline-block p-3 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-3 shadow-lg">
                  <Award size={36} className="text-white" />
                </div>
                <h1 className="text-3xl font-black text-[#00965E] mb-2">
                  CERTIFICADO DE EXCELENCIA
                </h1>
                <div style={{ 
                  width: '160px', 
                  height: '4px', 
                  background: 'linear-gradient(to right, #00965E, #EAB308, #00965E)',
                  margin: '0 auto',
                  borderRadius: '9999px'
                }}></div>
              </div>

              {/* Body */}
              <div className="text-center mb-4" style={{ maxWidth: '700px' }}>
                <p className="text-lg text-gray-600 mb-4">
                  Se certifica que
                </p>
                
                <h2 
                  className="text-3xl font-bold text-gray-900 py-3 mb-4"
                  style={{ 
                    borderTop: '2px solid #00965E',
                    borderBottom: '2px solid #00965E'
                  }}
                >
                  {userName}
                </h2>

                <p className="text-sm text-gray-700 leading-relaxed mb-4 px-8">
                  Ha completado exitosamente el programa <strong>BIOFIT EXPERT</strong>, 
                  demostrando dominio en los beneficios, ventajas competitivas y 
                  técnicas de venta de <strong style={{ color: '#00965E' }}>BIOFIT®</strong>.
                </p>

                <div 
                  className="rounded-lg p-3 border"
                  style={{ 
                    backgroundColor: '#f0fdf4',
                    borderColor: '#00965E',
                    maxWidth: '500px',
                    margin: '0 auto'
                  }}
                >
                  <p className="font-bold text-base" style={{ color: '#00965E' }}>
                    Embajador BIOFIT
                  </p>
                  <p className="text-xs text-gray-600 mt-1">
                    Capacitado para asesorar profesionalmente sobre salud digestiva y bienestar
                  </p>
                </div>
              </div>

              {/* Footer - Centered Date */}
              <div 
                className="text-center mt-4 pt-4"
                style={{ 
                  borderTop: '2px solid #e5e7eb',
                  maxWidth: '600px',
                  width: '100%'
                }}
              >
                <p className="text-xs text-gray-500 uppercase mb-1">Fecha de Emisión</p>
                <p className="font-bold text-gray-900 text-base">{today}</p>
              </div>

              {/* Brand Footer */}
              <div 
                className="text-center mt-3 pt-3"
                style={{ 
                  borderTop: '1px solid #e5e7eb',
                  maxWidth: '600px',
                  width: '100%'
                }}
              >
                <p className="text-xs text-gray-600">
                  <strong style={{ color: '#00965E' }}>BIOFIT®</strong> es un producto de <strong>PharmaBrand S.A.</strong>
                </p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="no-print grid grid-cols-2 gap-4 max-w-2xl mx-auto mt-6">
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
