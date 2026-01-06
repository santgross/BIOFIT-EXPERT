import * as XLSX from 'xlsx';

interface UserData {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  pharmacy_name: string;
  representative_name: string;
  created_at: string;
}

export const exportToExcel = (users: UserData[]) => {
  // Formatear los datos para el Excel
  const formattedData = users.map(user => ({
    'Nombre': user.first_name,
    'Apellido': user.last_name,
    'Email': user.email,
    'Celular': user.phone,
    'Farmacia': user.pharmacy_name,
    'Representante': user.representative_name,
    'Fecha Registro': new Date(user.created_at).toLocaleDateString('es-EC')
  }));

  // Crear el libro de trabajo
  const worksheet = XLSX.utils.json_to_sheet(formattedData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Usuarios BIOFIT');

  // Ajustar ancho de columnas
  const maxWidth = 20;
  worksheet['!cols'] = [
    { wch: maxWidth },
    { wch: maxWidth },
    { wch: maxWidth },
    { wch: 15 },
    { wch: maxWidth },
    { wch: maxWidth },
    { wch: 15 }
  ];

  // Generar el archivo
  const fileName = `usuarios_biofit_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
};
