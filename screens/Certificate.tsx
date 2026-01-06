import React, { useRef } from 'react';
import { Button } from '../components/Button';
import { Award, Download } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

interface Props {
  userName: string;
  onBack: () => void;
}

export const Certificate: React.FC<Props> = ({ userName, onBack }) => {
  const certificateRef = useRef<HTMLDivElement>(null);

  const downloadCertificate = async () => {
    if (!certificateRef.current) return;

    try {
      const canvas = await html2canvas(certificateRef.current, {
        scale: 2,
        backgroundColor: '#ffffff'
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4'
      });

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Certificado_BIOFIT_Expert_${userName.replace(/\s+/g, '_')}.pdf`);
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const today = new Date().toLocaleDateString('es-EC', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Certificate Preview */}
        <div 
          ref={certificateRef}
          className="bg-white rounded-2xl shadow-2xl p-12 mb-8 border-8 border-[#00965E]"
          style={{ aspectRatio: '1.414/1' }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block p-4 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full mb-4">
              <Award size={64} className="text-white" />
            </div>
            <h1 className="text-5xl font-black text-[#00965E] mb-2">
              CERTIFICADO DE EXCELENCIA
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-[#00965E] to-yellow-500 mx-auto"></div>
          </div>

          {/* Body */}
          <div className="text-center space-y-6 mb-8">
            <p className="text-xl text-gray-700">
              Se certifica que
            </p>
            
            <h2 className="text-4xl font-bold text-gray-900 py-4 border-b-2 border-t-2 border-[#00965E]">
              {userName}
            </h2>

            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
              Ha completado exitosamente el programa de entrenamiento <strong>BIOFIT EXPERT</strong>,
              demostrando excelencia en el conocimiento de los beneficios, ventajas competitivas
              y técnicas de venta del producto <strong>BIOFIT®</strong> - Fibra Natural de Psyllium Muciloide.
            </p>

            <p className="text-lg text-gray-700 leading-relaxed max-w-2xl mx-auto">
              Este logro lo posiciona como <strong className="text-[#00965E]">Embajador BIOFIT</strong>,
              con la capacidad de asesorar profesionalmente a pacientes sobre salud digestiva,
              control metabólico y bienestar general.
            </p>

            <p className="text-base text-gray-600 italic mt-8">
              ¡Felicitaciones por tu dedicación y compromiso con la excelencia en el servicio farmacéutico!
            </p>
          </div>

          {/* Footer */}
          <div className="flex justify-between items-end mt-12 pt-8 border-t-2 border-gray-200">
            <div className="text-left">
              <p className="text-sm text-gray-600">Fecha de emisión:</p>
              <p className="font-semibold text-gray-800">{today}</p>
            </div>
            
            <div className="text-center">
              <div className="w-48 border-t-2 border-gray-400 pt-2">
                <p className="text-sm font-semibold text-gray-700">Firma Autorizada</p>
                <p className="text-xs text-gray-500">PharmaBrand S.A.</p>
              </div>
            </div>

            <div className="text-right">
              <img 
                src="/LOGO-BIOFIT-SIN-FONDO.png" 
                alt="BIOFIT Logo" 
                className="h-16 opacity-80"
              />
            </div>
          </div>

          {/* Brand Footer */}
          <div className="text-center mt-8 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              BIOFIT® es un producto de <strong>PharmaBrand S.A.</strong>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Semillas de Psyllium Muciloide 47.70 g/100 g
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={downloadCertificate}
            className="flex items-center gap-2 bg-gradient-to-r from-[#00965E] to-green-700 hover:from-green-700 hover:to-[#00965E] text-white px-8 py-4 text-lg shadow-xl"
          >
            <Download size={24} />
            Descargar Certificado PDF
          </Button>
          
          <Button 
            onClick={onBack}
            className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-8 py-4 text-lg"
          >
            Volver al Inicio
          </Button>
        </div>

        {/* Congratulations Message */}
        <div className="mt-8 bg-gradient-to-r from-yellow-50 to-green-50 rounded-xl p-6 text-center border-2 border-yellow-200">
          <p className="text-lg font-semibold text-[#00965E] mb-2">
            🎉 ¡Felicitaciones! 🎉
          </p>
          <p className="text-gray-700">
            Has completado todos los módulos de entrenamiento BIOFIT EXPERT.
            Ahora estás preparado para ser un asesor de excelencia en tu farmacia.
          </p>
        </div>
      </div>
    </div>
  );
};
