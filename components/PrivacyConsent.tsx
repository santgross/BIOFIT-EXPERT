import React from 'react';
import { Shield, CheckCircle } from 'lucide-react';
import { Button } from './Button';

interface Props {
  onAccept: () => void;
}

export const PrivacyConsent: React.FC<Props> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-8">
          {/* Header */}
          <div className="flex items-center justify-center mb-6">
            <Shield className="biofit-green mr-3" size={40} />
            <h2 className="text-2xl font-bold biofit-green">
              Aviso de Protección de Datos Personales
            </h2>
          </div>

          {/* Contenido */}
          <div className="space-y-4 text-gray-700 mb-6">
            <p className="leading-relaxed">
              Al registrarte en esta aplicación, autorizas el tratamiento de tus datos personales 
              (nombre, teléfono, correo electrónico y farmacia donde trabajas) conforme a la{' '}
              <strong>Ley Orgánica de Protección de Datos Personales del Ecuador</strong>.
            </p>

            <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
              <p className="font-semibold biofit-green mb-2">
                Tus datos serán utilizados únicamente para:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start">
                  <CheckCircle className="biofit-green mr-2 flex-shrink-0 mt-1" size={16} />
                  <span>Gestionar tu acceso a la app</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="biofit-green mr-2 flex-shrink-0 mt-1" size={16} />
                  <span>Brindarte contenidos educativos</span>
                </li>
                <li className="flex items-start">
                  <CheckCircle className="biofit-green mr-2 flex-shrink-0 mt-1" size={16} />
                  <span>Validar tu participación en dinámicas y entrega de premios</span>
                </li>
              </ul>
            </div>

            <p className="leading-relaxed">
              Tu información será tratada de forma <strong>confidencial y segura</strong>, y no será 
              compartida con terceros no autorizados.
            </p>

            <p className="leading-relaxed">
              Puedes ejercer tus derechos de <strong>acceso, actualización o eliminación</strong> de 
              datos a través de los canales indicados en la aplicación.
            </p>

            <div className="bg-gray-100 border border-gray-300 p-4 rounded mt-6">
              <p className="text-sm biofit-green font-semibold flex items-center">
                <CheckCircle className="mr-2" size={20} />
                Al continuar, declaras que has leído y aceptas esta política.
              </p>
            </div>
          </div>

          {/* Botón de aceptación */}
          <Button 
            onClick={onAccept}
            className="w-full py-4 text-lg font-semibold"
          >
            Acepto la Política de Protección de Datos
          </Button>
        </div>
      </div>
    </div>
  );
};
