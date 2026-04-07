"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, FileText, Loader2, Download, X, Eye } from "lucide-react";

export default function Home() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [pdfUrl, setPdfUrl] = useState(null);

  // Install Prompt state for PWA
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const simulateProgress = () => {
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((old) => {
        if (old >= 90) {
          clearInterval(interval);
          return 90;
        }
        return old + 10;
      });
    }, 300);
    return interval;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setPdfUrl(null);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    const progressInterval = simulateProgress();

    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      clearInterval(progressInterval);
      setProgress(100);

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      
      setLoading(false);
      setPdfUrl(url); // Triggers the Preview Modal
      
      // Auto Download
      setTimeout(() => {
        const a = document.createElement("a");
        a.href = url;
        a.download = `contract_${Date.now()}.pdf`;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }, 1000);

    } catch (err) {
      clearInterval(progressInterval);
      setProgress(0);
      setLoading(false);
      alert("Error generating PDF. Please try again.");
      console.error(err);
    }
  };

  const InputField = ({ name, placeholder, type = "text", required = true }) => (
    <motion.div whileTap={{ scale: 0.99 }} className="w-full">
      <input
        required={required}
        placeholder={placeholder}
        type={type}
        name={name}
        className="w-full bg-slate-50 border border-slate-200 text-slate-900 placeholder-slate-400 p-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[#008CBA] focus:bg-white transition-all font-medium shadow-sm"
      />
    </motion.div>
  );

  return (
    <main dir="rtl" className="flex justify-center min-h-screen w-full font-bold bg-[#f1f5f9] sm:p-6 overflow-hidden">
      
      {/* Install PWA Prompt Banner */}
      <AnimatePresence>
        {deferredPrompt && (
          <motion.div 
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-4 z-50 bg-white shadow-xl rounded-full px-6 py-3 flex items-center gap-4 cursor-pointer hover:bg-slate-50 transition-colors border border-slate-200"
            onClick={() => {
              deferredPrompt.prompt();
              deferredPrompt.userChoice.then(() => setDeferredPrompt(null));
            }}
          >
            <Download className="w-5 h-5 text-[#008CBA]" />
            <span className="text-slate-800 text-sm">تثبيت التطبيق (PWA)</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF Preview Modal */}
      <AnimatePresence>
        {pdfUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm sm:p-8"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-3xl w-full max-w-sm flex flex-col shadow-2xl p-8 text-center relative"
            >
              <button 
                onClick={() => setPdfUrl(null)}
                className="absolute top-4 right-4 p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-400" />
              </button>
              
              <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-12 h-12 text-green-500" />
              </div>
              
              <h2 className="text-2xl font-bold text-slate-900 mb-2">تم توليد العقد!</h2>
              <p className="text-sm text-slate-500 font-medium mb-8">لقد تم إنشاء عقد العمل الخاص بك بنجاح وهو جاهز للتحميل الآن.</p>
              
              <div className="flex flex-col gap-3">
                <a 
                  href={pdfUrl} 
                  download={`contract_${Date.now()}.pdf`}
                  onClick={() => setTimeout(() => setPdfUrl(null), 500)}
                  className="w-full bg-[#008CBA] text-white rounded-2xl py-4 font-bold text-lg shadow-lg shadow-blue-500/20 flex justify-center items-center gap-2 transition-transform active:scale-95"
                >
                  <Download className="w-6 h-6" />
                  تحميل ومشاركة (PDF)
                </a>
                
                <button 
                  onClick={() => {
                    window.open(pdfUrl, '_blank');
                  }}
                  className="w-full bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-2xl py-4 font-bold text-lg flex justify-center items-center gap-2 transition-transform active:scale-95"
                >
                  <Eye className="w-6 h-6 text-slate-400" />
                  فتح للمعاينة
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full max-w-xl h-full sm:h-auto bg-white sm:rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden flex flex-col relative pb-8">
        
        {/* App Header */}
        <div className="sticky top-0 z-10 bg-white/90 backdrop-blur-xl pt-10 pb-6 px-8 border-b border-slate-100 flex flex-col items-center">
          <img 
            src="https://saymamanpower.com/Saymalogo.bcb280ec7a2e3fbd5000e13555ca1240_1_.svg" 
            alt="Sayma Logo" 
            className="h-14 mb-4 object-contain drop-shadow-sm"
          />
          <h1 className="text-slate-900 text-xl font-extrabold tracking-wide">نظام العقود الذكية</h1>
          <p className="text-slate-500 text-sm font-medium mt-1">يرجى ملء بيانات العقد بدقة</p>
        </div>

        {/* Form Body */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 sm:px-8 py-6">
          <form className="flex flex-col gap-5" id="contractForm" onSubmit={handleSubmit}>
            
            <div className="flex items-center justify-between gap-4">
              <InputField name="naam" placeholder="الطرف الثاني (الاسم)" />
              <InputField name="raqam" placeholder="الرقم المدني" type="number" />
            </div>
            
            <InputField name="madvia" placeholder="الرقم الماذونية" />
            
            <div className="flex items-center gap-4">
              <InputField name="hafza" placeholder="العنوان المحافظة" />
              <InputField name="walid" placeholder="الولاية" />
            </div>

            <InputField name="hatif" placeholder="رقم الهاتف" type="number" />
            
            <div className="bg-slate-50 rounded-2xl p-2 border border-slate-200 shadow-sm">
              <label className="text-xs text-slate-500 px-3 block mb-1">تاريخ الاتفاق</label>
              <input
                required
                type="date"
                name="date"
                className="w-full bg-transparent text-slate-900 p-2 px-3 border-none focus:outline-none font-medium"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <InputField name="mastaqdam" placeholder="قيمة الاستقدام (ر.ع)" type="number" />
              <InputField name="yadfa" placeholder="الراتب الشهري (ر.ع)" type="number" />
            </div>

            <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100 mt-2 flex flex-col gap-4 shadow-sm">
              <h3 className="text-blue-800 text-sm flex items-center gap-2 mb-1">
                <FileText className="w-4 h-4" />
                بيانات العاملة
              </h3>
              <InputField name="aamil" placeholder="اسم العاملة" />
              <div className="flex gap-4">
                <InputField name="khaldal" placeholder="رقم الجواز" />
                <InputField name="jins" placeholder="الجنسية" />
              </div>
            </div>

          </form>
        </div>

        {/* Fixed Footer for Action Button */}
        <div className="px-6 sm:px-8 pt-4">
          <button
            form="contractForm"
            disabled={loading}
            className="group relative w-full h-16 bg-[#008CBA] text-white rounded-2xl font-bold text-lg shadow-lg shadow-blue-500/30 overflow-hidden transform transition-all active:scale-95 disabled:hover:scale-100 disabled:active:scale-100 disabled:opacity-90 disabled:cursor-wait"
          >
            <AnimatePresence mode="popLayout">
              {loading ? (
                <motion.div 
                  key="loading"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute inset-0 flex flex-col items-center justify-center p-2"
                >
                  <div className="flex items-center gap-3 z-10">
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>جاري التوليد...</span>
                  </div>
                  <div className="absolute bottom-0 left-0 h-1 bg-white/20 w-full" />
                  <motion.div 
                    initial={{ width: "0%" }}
                    animate={{ width: `${progress}%` }}
                    className="absolute bottom-0 left-0 h-1 bg-yellow-400 z-0 transition-all duration-300"
                  />
                </motion.div>
              ) : (
                <motion.div 
                  key="idle"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute inset-0 flex items-center justify-center gap-3"
                >
                  <Eye className="w-6 h-6 group-hover:scale-110 transition-transform" />
                  <span>توليد ومعاينة العقد</span>
                </motion.div>
              )}
            </AnimatePresence>
          </button>
        </div>
      </div>
      
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 5px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0, 0, 0, 0.1); border-radius: 10px; }
        input[type="number"]::-webkit-inner-spin-button, 
        input[type="number"]::-webkit-outer-spin-button { -webkit-appearance: none; margin: 0; }
        input[type="date"]::-webkit-calendar-picker-indicator { cursor: pointer; filter: invert(0.5); }
      `}} />
    </main>
  );
}
