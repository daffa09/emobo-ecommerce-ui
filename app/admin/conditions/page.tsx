"use client";

import { useEffect, useState } from "react";
import { Condition, fetchConditions, createCondition, updateCondition, deleteCondition } from "@/lib/api-service";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function ConditionsPage() {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCondition, setEditingCondition] = useState<Condition | null>(null);
  const [formName, setFormName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadConditions();
  }, []);

  const loadConditions = async () => {
    try {
      setIsLoading(true);
      const data = await fetchConditions();
      setConditions(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (condition?: Condition) => {
    if (condition) {
      setEditingCondition(condition);
      setFormName(condition.name);
    } else {
      setEditingCondition(null);
      setFormName("");
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCondition) {
        await updateCondition(editingCondition.id, { name: formName });
      } else {
        await createCondition({ name: formName });
      }
      setIsModalOpen(false);
      loadConditions();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this condition?")) {
      try {
        await deleteCondition(id);
        loadConditions();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen p-8 relative overflow-hidden bg-[#ECFDF5] text-[#064E3B]">
      {/* Liquid Glass Background Elements */}
      <div className="absolute top-[20%] right-[-5%] w-[30%] h-[30%] bg-[#F97316] opacity-10 rounded-full blur-[120px] animate-pulse"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#059669] opacity-20 rounded-full blur-[100px] animate-pulse" style={{ animationDelay: "1s" }}></div>

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight font-fira-sans text-[#059669]">
            Manage Conditions
          </h1>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-[#059669] to-[#10B981] text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-[#10B981]/50 hover:-translate-y-1 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            Add Condition
          </button>
        </div>

        {/* Glass Card */}
        <div className="bg-white/60 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-8">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#059669]"></div>
              </div>
            ) : conditions.length === 0 ? (
              <div className="text-center py-12 text-[#064E3B]/70">
                <p className="text-lg">No conditions found. Add your first condition!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-[#10B981]/20">
                      <th className="pb-4 font-semibold text-[#064E3B]">Condition Name</th>
                      <th className="pb-4 font-semibold text-[#064E3B] text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {conditions.map((condition) => (
                      <tr key={condition.id} className="border-b border-[#10B981]/10 hover:bg-white/40 transition-colors duration-200">
                        <td className="py-4 font-medium">{condition.name}</td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleOpenModal(condition)}
                            className="p-2 text-[#059669] hover:bg-[#059669]/10 rounded-lg transition-colors mr-2 cursor-pointer"
                            title="Edit"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(condition.id)}
                            className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-5 h-5" />
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

      {/* Modal - Glassmorphism style */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#064E3B]/20 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-white/80 backdrop-blur-xl border border-white/50 w-full max-w-md rounded-3xl shadow-2xl p-8 transform transition-all scale-100">
            <h2 className="text-2xl font-bold text-[#059669] mb-6">
              {editingCondition ? "Edit Condition" : "Add New Condition"}
            </h2>
            {error && (
              <div className="mb-4 p-4 bg-red-100/50 border border-red-200 text-red-600 rounded-xl text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-[#064E3B] mb-2">Condition Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-white/50 border border-[#10B981]/30 focus:border-[#059669] focus:ring-2 focus:ring-[#059669]/20 outline-none transition-all placeholder-[#064E3B]/40 text-[#064E3B]"
                  placeholder="e.g. New, Used, Refurbished"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-medium text-[#064E3B] hover:bg-[#10B981]/10 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-medium bg-[#059669] text-white hover:bg-[#047857] shadow-lg shadow-[#059669]/30 transition-all cursor-pointer"
                >
                  {editingCondition ? "Save Changes" : "Create Condition"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
