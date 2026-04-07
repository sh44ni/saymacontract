"use client";
import { useState } from "react";

export default function Home() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/pdf", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error("Failed to generate PDF");

      // Handle File Download safely
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `contract_${Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("Error generating PDF. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex justify-center h-auto min-h-screen w-full font-bold">
      <div className="container contact-form-page w-full max-w-2xl p-4">
        <form className="contactUsForm flex flex-col gap-4" onSubmit={handleSubmit}>
          <div className="first-two flex items-center justify-between gap-x-2">
            <input
              className="w-full border p-2 rounded"
              required
              placeholder="الطرف الثاني"
              type="text"
              name="naam"
            />
            <input
              className="w-full border p-2 rounded"
              required
              placeholder="الرقم المدني"
              type="number"
              name="raqam"
            />
          </div>
          <input
            className="block w-full border p-2 rounded"
            required
            placeholder="الرقم الماذونية"
            type="text"
            name="madvia"
          />
          <input
            className="block w-full border p-2 rounded"
            required
            placeholder="العنوان المحافظة"
            type="text"
            name="hafza"
          />
          <input
            className="block w-full border p-2 rounded"
            required
            placeholder="ولاية"
            type="text"
            name="walid"
          />
          <input
            className="block w-full border p-2 rounded"
            required
            placeholder="رقم الهاتف"
            type="number"
            name="hatif"
          />
          <input
            className="block w-full border p-2 rounded"
            required
            placeholder="يوم الاحد بتاريخ"
            type="date"
            name="date"
          />
          <input
            className="block w-full border p-2 rounded"
            required
            placeholder="قيمه الاستقدام"
            type="number"
            name="mastaqdam"
          />
          <input
            className="block w-full border p-2 rounded"
            required
            placeholder="والعاملة تدعي"
            type="text"
            name="aamil"
          />
          <input
            className="block w-full border p-2 rounded"
            required
            placeholder="رقم الجواز"
            type="text"
            name="khaldal"
          />
          <input
            className="block w-full border p-2 rounded"
            required
            placeholder="الجنسية"
            type="text"
            name="jins"
          />
          <input
            className="block w-full border p-2 rounded"
            required
            placeholder="شهري وقدره"
            type="number"
            name="yadfa"
          />
          <button
            disabled={loading}
            className={`bg-[#008CBA] text-white px-4 py-3 mt-4 rounded-lg font-medium transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#007B9A]"
            }`}
          >
            {loading ? "Generating PDF..." : "Download as pdf"}
          </button>
        </form>
      </div>
    </main>
  );
}
