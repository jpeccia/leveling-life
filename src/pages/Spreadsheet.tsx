import { useState, useRef } from 'react';
import { Layout } from '../components/Layout';
import {
  FileSpreadsheet,
  Upload,
  Download,
  Plus,
  MinusCircle,
  AlertCircle,
  CheckCircle,
} from 'lucide-react';
import ExcelJS from 'exceljs';
import {
  createColumnHelper,
} from '@tanstack/react-table';

interface SpreadsheetData {
  [key: string]: string | number | null;
}

export default function Spreadsheet() {
  const [data, setData] = useState<SpreadsheetData[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [importSuccess, setImportSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const columnHelper = createColumnHelper<SpreadsheetData>();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);
    setImportSuccess(false);
    setError('');

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const workbook = new ExcelJS.Workbook();
        await workbook.xlsx.load(e.target?.result as ArrayBuffer);

        const worksheet = workbook.worksheets[0];
        const jsonData: SpreadsheetData[] = [];

        // Converter linhas da planilha em JSON
        worksheet.eachRow((row, rowIndex) => {
          if (rowIndex === 1) return; // Ignorar a primeira linha (cabeçalho)
          const rowData: SpreadsheetData = {};
          row.eachCell((cell, colIndex) => {
            const columnHeader = worksheet.getRow(1).getCell(colIndex).value as string;
            rowData[columnHeader] = cell.value ?? null;
          });
          jsonData.push(rowData);
        });

        if (jsonData.length > 0) {
          const allColumns = new Set<string>();

          jsonData.forEach((row: any) => {
            Object.keys(row).forEach((col) => {
              allColumns.add(col);
            });
          });

          const cols = Array.from(allColumns).map((key) =>
            columnHelper.accessor(key as any, {
              header: key,
              cell: (info) => info.getValue(),
            })
          );

          setColumns(cols);
          setData(jsonData);
          setImportSuccess(true);
        }
      } catch (err) {
        setError('Erro ao ler a planilha. Verifique o formato do arquivo.');
      } finally {
        setLoading(false);
      }
    };

    reader.onerror = () => {
      setError('Erro ao ler o arquivo.');
      setLoading(false);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleExport = async () => {
    if (data.length === 0) {
      setError('Nenhum dado disponível para exportação.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Planilha1');

    // Adicionar colunas à planilha
    const columns = Object.keys(data[0]);
    worksheet.columns = columns.map((col) => ({ header: col, key: col }));

    // Adicionar linhas de dados
    data.forEach((row) => {
      worksheet.addRow(row);
    });

    try {
      const buffer = await workbook.xlsx.writeBuffer();
      const blob = new Blob([buffer], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'dados_exportados.xlsx';
      link.click();
    } catch (error) {
      setError('Erro ao exportar a planilha.');
    }
  };

  const addRow = () => {
    if (columns.length === 0) {
      setError('Adicione uma planilha ou crie colunas antes de inserir linhas.');
      return;
    }
    const newRow: SpreadsheetData = {};
    columns.forEach((col) => {
      newRow[col.header] = '';
    });
    setData([...data, newRow]);
  };

  const addColumn = () => {
    const columnName = `Coluna ${columns.length + 1}`;
    const newColumn = columnHelper.accessor(columnName as any, {
      header: columnName,
      cell: (info) => info.getValue(),
    });
    setColumns([...columns, newColumn]);

    const updatedData = data.map((row) => ({
      ...row,
      [columnName]: '',
    }));
    setData(updatedData);
  };

  const removeRow = (index: number) => {
    if (index < 0 || index >= data.length) {
      setError('Índice de linha inválido.');
      return;
    }
    const updatedData = data.filter((_, rowIndex) => rowIndex !== index);
    setData(updatedData);
  };

  const removeColumn = (columnName: string) => {
    const columnExists = columns.some((col) => col.header === columnName);

    if (!columnExists) {
      setError('Coluna não encontrada.');
      return;
    }

    const updatedColumns = columns.filter((col) => col.header !== columnName);
    setColumns(updatedColumns);

    const updatedData = data.map((row) => {
      const newRow = { ...row };
      delete newRow[columnName];
      return newRow;
    });

    setData(updatedData);
  };

  const handleCellChange = (
    rowIndex: number,
    columnName: string,
    value: string | number
  ) => {
    const updatedData = [...data];
    updatedData[rowIndex][columnName] = value;
    setData(updatedData);
  };



  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          {/* Header */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <FileSpreadsheet className="h-6 w-6 text-indigo-600" />
                <h1 className="text-2xl font-bold text-gray-900">
                  Editar Planilhas
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>Importar</span>
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Exportar</span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".xlsx,.xls,.csv"
                  className="hidden"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button
                onClick={addRow}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar Linha</span>
              </button>
              <button
                onClick={addColumn}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Adicionar Coluna</span>
              </button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-auto p-6" style={{ maxHeight: '60vh', maxWidth: '100%' }}>
            {error && (
              <div className="flex items-center space-x-2 bg-red-100 p-3 rounded-lg text-red-700 mb-4">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
            {importSuccess && (
              <div className="flex items-center space-x-2 bg-green-100 p-3 rounded-lg text-green-700 mb-4">
                <CheckCircle className="h-5 w-5" />
                <span>Planilha importada com sucesso!.</span>
              </div>
            )}
            <table className="min-w-full table-auto border-collapse border border-gray-200">
              <thead>
                {columns.length > 0 && (
                  <tr>
                    {columns.map((col) => (
                      <th key={col.id} className="px-4 py-2 border-b">{col.header}</th>
                    ))}
                    <th className="px-4 py-2 border-b">Ações</th>
                  </tr>
                )}
              </thead>
              <tbody>
                {data.length > 0 &&
                  data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                      {columns.map((col) => (
                        <td key={col.id} className="px-4 py-2 border-b">
                          <input
                            type="text"
                            value={row[col.header]}
                            onChange={(e) =>
                              handleCellChange(rowIndex, col.header, e.target.value)
                            }
                            className="w-full px-2 py-1 text-sm rounded-md border border-gray-300"
                          />
                        </td>
                      ))}
                      <td className="px-4 py-2 border-b">
                        <button
                          onClick={() => removeRow(rowIndex)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <MinusCircle className="h-5 w-5" />
                        </button>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  );
}
