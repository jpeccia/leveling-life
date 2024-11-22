import { useState, useRef } from 'react';
import { Layout } from '../components/Layout';
import {
  FileSpreadsheet,
  Upload,
  Download,
  Plus,
  AlertCircle,
} from 'lucide-react';
import { read, utils, writeFile } from 'xlsx';
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table';

interface SpreadsheetData {
  [key: string]: string | number;
}

export default function Spreadsheet() {
  const [data, setData] = useState<SpreadsheetData[]>([]);
  const [columns, setColumns] = useState<any[]>([]);
  const [error, setError] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const columnHelper = createColumnHelper<SpreadsheetData>();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = read(e.target?.result, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = utils.sheet_to_json<SpreadsheetData>(worksheet);

        if (jsonData.length > 0) {
          setData(jsonData);
          const cols = Object.keys(jsonData[0]).map((key) =>
            columnHelper.accessor(key as any, {
              header: key,
              cell: (info) => info.getValue(),
            })
          );
          setColumns(cols);
          setError('');
        }
      } catch (err) {
        setError('Error reading spreadsheet. Please check the file format.');
      }
    };
    reader.onerror = () => {
      setError('Error reading file');
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
    const columnName = `Column${columns.length + 1}`;
    const newColumn = columnHelper.accessor(columnName as any, {
      header: columnName,
      cell: (info) => info.getValue(),
    });
    setColumns([...columns, newColumn]);
    
    const updatedData = data.map(row => ({
      ...row,
      [columnName]: ''
    }));
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

            {error && (
              <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center space-x-2">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                {table.getHeaderGroups().map((headerGroup) => (
                  <tr key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <th
                        key={header.id}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {table.getRowModel().rows.map((row) => (
                  <tr key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <td
                        key={cell.id}
                        className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                      >
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>

            {data.length === 0 && (
              <div className="text-center py-12">
                <FileSpreadsheet className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">
                  No data available. Import a spreadsheet or add rows and columns to
                  get started.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}