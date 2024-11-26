import { useState, useRef } from 'react';
import { Layout } from '../components/Layout';
import {
  FileSpreadsheet,
  Upload,
  Download,
  Plus,
  MinusCircle, // Ícone para remover
  AlertCircle,
  CheckCircle,
  Loader,
} from 'lucide-react';
import { read, utils, writeFile } from 'xlsx';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
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
    reader.onload = (e) => {
      try {
        const workbook = read(e.target?.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        const jsonData = utils.sheet_to_json<SpreadsheetData>(worksheet, {
          header: 1,
          defval: '',
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

          const updatedData = jsonData.map((row: any) => {
            const filledRow: SpreadsheetData = {};
            allColumns.forEach((col) => {
              filledRow[col] = row[col] || null;
            });
            return filledRow;
          });

          setData(updatedData);
          setImportSuccess(true);
        }
      } catch (err) {
        setError('Error reading spreadsheet. Please check the file format.');
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Error reading file');
      setLoading(false);
    };
    reader.readAsBinaryString(file);
  };

  const handleExport = () => {
    if (data.length === 0) {
      setError('No data to export');
      return;
    }

    const worksheet = utils.json_to_sheet(data);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    writeFile(workbook, 'exported_data.xlsx');
  };

  const addRow = () => {
    if (columns.length === 0) {
      setError('Please upload a spreadsheet first or add columns');
      return;
    }
    const newRow: SpreadsheetData = {};
    columns.forEach((col) => {
      newRow[col.header] = '';
    });
    setData([...data, newRow]);
  };

  const addColumn = () => {
    const columnName = `${columns.length}`;
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

  // Remover linha específica
  const removeRow = (index: number) => {
    if (index < 0 || index >= data.length) {
      setError('Invalid row index');
      return;
    }
    const updatedData = data.filter((_, rowIndex) => rowIndex !== index);
    setData(updatedData);
  };

  // Remover coluna específica
  const removeColumn = (columnName: string) => {
    // Verificar se a coluna existe
    const columnExists = columns.some((col) => col.header === columnName);
    
    if (!columnExists) {
      setError('Column not found');
      return;
    }
  
    // Remover a coluna
    const updatedColumns = columns.filter((col) => col.header !== columnName);
    setColumns(updatedColumns);
  
    // Remover a coluna dos dados
    const updatedData = data.map((row) => {
      const newRow = { ...row };
      delete newRow[columnName]; // Remover a chave correspondente à coluna
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

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

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
                  Spreadsheet Manager
                </h1>
              </div>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>Import</span>
                </button>
                <button
                  onClick={handleExport}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  <Download className="h-4 w-4" />
                  <span>Export</span>
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
                <span>Add Row</span>
              </button>
              <button
                onClick={addColumn}
                className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm"
              >
                <Plus className="h-4 w-4" />
                <span>Add Column</span>
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
                <span>File imported successfully!</span>
              </div>
            )}
            {loading && (
              <div className="flex justify-center items-center py-6">
                <Loader className="h-6 w-6 text-indigo-600 animate-spin" />
              </div>
            )}
            {!loading && data.length > 0 && (
              <div className="table-wrapper">
                <table className="min-w-full border-collapse border border-gray-200">
                  <thead>
                    {table.getHeaderGroups().map((headerGroup) => (
                      <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => (
                          <th
                            key={header.id}
                            className="px-4 py-2 text-left text-lg border border-gray-300 bg-gray-50 relative"
                          >
                            {header.isPlaceholder
                              ? null
                              : flexRender(
                                  header.column.columnDef.header,
                                  header.getContext()
                                )}
                            <button
                              onClick={() => removeColumn(header.id)}
                              className="absolute top-1 right-1 text-red-600 hover:text-red-800"
                            >
                              ×
                            </button>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody>
                    {table.getRowModel().rows.map((row) => (
                      <tr key={row.id}>
                        {row.getVisibleCells().map((cell) => (
                          <td
                            key={cell.id}
                            className="border border-gray-300 px-4 py-2 text-lg"
                          >
                            <input
                              type="text"
                              value={cell.getValue() || ''}
                              onChange={(e) =>
                                handleCellChange(
                                  row.index,
                                  cell.column.id,
                                  e.target.value
                                )
                              }
                              className="w-full border-none bg-transparent focus:ring-2 focus:ring-indigo-600 text-lg"
                            />
                          </td>
                        ))}
                        <td className="border border-gray-300 px-4 py-2 text-center">
                          <button
                            onClick={() => removeRow(row.index)}
                            className="text-red-600 hover:underline"
                          >
                            Remove
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}
