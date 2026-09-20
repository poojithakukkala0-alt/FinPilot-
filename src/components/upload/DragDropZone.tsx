import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  FileText,
  CreditCard,
  Building,
  Receipt,
  FileCheck,
  CheckCircle2,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import { uploadFinancialData } from '../../services/api';
import { UploadResult } from '../../types';
import { useFinance } from '../../context/FinanceContext';

export const UploadDataView: React.FC = () => {
  const { setActiveNav, addToast } = useFinance();
  const [isDragging, setIsDragging] = useState(false);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [uploadProgress, setUploadProgress] = useState<boolean>(false);
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [uploadedFileName, setUploadedFileName] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const steps = [
    'Uploading document...',
    'Parsing tabular & unstructured data...',
    'Categorizing expenses via agentic heuristics...',
    'Detecting recurring payment commitments...',
    'Synthesizing spending insights & budget impact...',
  ];

  const handleProcessFile = async (file: File) => {
    setUploadedFileName(file.name);
    setUploadProgress(true);
    setUploadResult(null);
    setCurrentStep(0);

    // Realistic multi-step progress pipeline
    for (let i = 0; i < steps.length; i++) {
      setCurrentStep(i);
      await new Promise((r) => setTimeout(r, 650));
    }

    try {
      const res = await uploadFinancialData(file);
      setUploadResult(res);
      addToast('Upload Complete', `Processed 1,000 transactions from ${file.name}.`, 'success');
    } catch (err) {
      addToast('Upload Failed', 'Failed to process file. Please try again.', 'error');
    } finally {
      setUploadProgress(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleProcessFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleProcessFile(e.target.files[0]);
    }
  };

  const supportedTypes = [
    {
      title: 'Bank Statements',
      desc: 'HDFC, SBI, ICICI, Axis, Kotak (PDF, CSV, XLS)',
      icon: Building,
      badge: 'CSV / PDF',
    },
    {
      title: 'Credit Card Statements',
      desc: 'Monthly statement summaries & detailed billed items',
      icon: CreditCard,
      badge: 'PDF / XLS',
    },
    {
      title: 'Utility Bills',
      desc: 'Electricity (BESCOM), Broadband (Airtel), Mobile',
      icon: Receipt,
      badge: 'PDF / Image',
    },
    {
      title: 'Expense Records',
      desc: 'Custom spreadsheets, Splitwise exports, ERP ledgers',
      icon: FileSpreadsheet,
      badge: 'CSV / Excel',
    },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Drag and Drop Box */}
      {!uploadProgress && !uploadResult && (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-3xl p-8 sm:p-14 text-center transition-all duration-200 cursor-pointer ${
            isDragging
              ? 'border-teal-500 bg-teal-50/50 scale-[1.01]'
              : 'border-slate-300 bg-white hover:border-teal-400 hover:bg-slate-50/50 shadow-fintech-card'
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv, .xlsx, .xls, .pdf"
            onChange={handleFileChange}
            className="hidden"
          />

          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4 border border-teal-200/60 shadow-sm">
            <UploadCloud className="w-8 h-8" />
          </div>

          <h3 className="text-lg sm:text-xl font-bold text-fintech-navy-900">
            Drag & drop files here
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            Upload bank statements, credit card bills, or CSV ledgers. FinPilot AI will automatically categorize and integrate them.
          </p>

          <div className="mt-6 flex items-center justify-center gap-2">
            <button
              type="button"
              className="px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-fintech-navy-900 text-white hover:bg-fintech-navy-800 transition-colors shadow-sm"
            >
              Choose Files
            </button>
            <span className="text-xs text-slate-400">or drop CSV, Excel, PDF</span>
          </div>
        </div>
      )}

      {/* Progress View */}
      {uploadProgress && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200 shadow-fintech-card text-center max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-teal-50 text-teal-600 flex items-center justify-center mx-auto mb-4 border border-teal-200 animate-pulse">
            <Sparkles className="w-8 h-8" />
          </div>

          <h3 className="text-lg font-bold text-fintech-navy-900">
            Analyzing {uploadedFileName}...
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            FinPilot financial parsing engine in progress
          </p>

          {/* Stepper */}
          <div className="mt-8 space-y-3 text-left">
            {steps.map((step, idx) => {
              const isCompleted = idx < currentStep;
              const isCurrent = idx === currentStep;
              return (
                <div
                  key={idx}
                  className={`flex items-center gap-3 p-2.5 rounded-xl text-xs font-medium transition-all ${
                    isCompleted
                      ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                      : isCurrent
                      ? 'bg-teal-50 text-teal-900 border border-teal-300 font-semibold shadow-sm'
                      : 'text-slate-400 bg-slate-50 border border-transparent opacity-60'
                  }`}
                >
                  <div className="shrink-0">
                    {isCompleted ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : isCurrent ? (
                      <div className="w-4 h-4 rounded-full border-2 border-teal-600 border-t-transparent animate-spin" />
                    ) : (
                      <div className="w-4 h-4 rounded-full border border-slate-300" />
                    )}
                  </div>
                  <span>{step}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Success View */}
      {uploadResult && (
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-emerald-200/80 shadow-fintech-card text-center max-w-xl mx-auto animate-in fade-in">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 border border-emerald-200 shadow-sm">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h3 className="text-xl font-bold text-fintech-navy-900">
            Processing Successful!
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
            {uploadResult.message}
          </p>

          {/* Summary Badges Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-7 text-left">
            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Transactions
              </span>
              <span className="text-base font-extrabold text-slate-800 mt-0.5 block">
                ✓ 1,000 processed
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Categories
              </span>
              <span className="text-base font-extrabold text-slate-800 mt-0.5 block">
                ✓ 10 detected
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Recurring
              </span>
              <span className="text-base font-extrabold text-slate-800 mt-0.5 block">
                ✓ 4 found
              </span>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200">
              <span className="text-[10px] uppercase font-bold text-slate-400 block">
                Insights
              </span>
              <span className="text-base font-extrabold text-slate-800 mt-0.5 block">
                ✓ 3 generated
              </span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={() => setActiveNav('dashboard')}
              className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 text-white transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <span>View Dashboard</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setActiveNav('transactions')}
              className="w-full sm:w-auto px-5 py-2.5 text-xs sm:text-sm font-semibold rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
            >
              View Transactions
            </button>

            <button
              onClick={() => {
                setUploadResult(null);
                setUploadedFileName('');
              }}
              className="text-xs text-slate-400 hover:text-slate-600 px-3 py-2"
            >
              Upload another file
            </button>
          </div>
        </div>
      )}

      {/* Supported Data Types Grid */}
      <div>
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 px-1">
          Supported Statement Formats
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {supportedTypes.map((t) => {
            const Icon = t.icon;
            return (
              <div
                key={t.title}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-fintech-card hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-2 rounded-xl bg-slate-100 text-slate-700">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 border border-slate-200">
                      {t.badge}
                    </span>
                  </div>
                  <h5 className="text-sm font-bold text-fintech-navy-900">
                    {t.title}
                  </h5>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {t.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
