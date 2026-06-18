"use client";

import { useEffect, useState } from "react";
import { Brand, fetchBrands, createBrand, updateBrand, deleteBrand } from "@/lib/api-service";
import { Plus, Pencil, Trash2 } from "lucide-react";

export default function BrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [formName, setFormName] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setIsLoading(true);
      const data = await fetchBrands();
      setBrands(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = (brand?: Brand) => {
    if (brand) {
      setEditingBrand(brand);
      setFormName(brand.name);
    } else {
      setEditingBrand(null);
      setFormName("");
    }
    setError(null);
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingBrand) {
        await updateBrand(editingBrand.id, { name: formName });
      } else {
        await createBrand({ name: formName });
      }
      setIsModalOpen(false);
      loadBrands();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this brand?")) {
      try {
        await deleteBrand(id);
        loadBrands();
      } catch (err: any) {
        alert(err.message);
      }
    }
  };

  return (
    <div className="min-h-screen p-8 relative overflow-hidden bg-zinc-950 text-zinc-100">

      <div className="max-w-6xl mx-auto relative z-10">
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight font-fira-sans text-zinc-100">
            Manage Brands
          </h1>
          <button
            onClick={() => handleOpenModal()}
            className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-400 text-white px-6 py-3 rounded-xl font-medium shadow-lg hover:shadow-blue-500/25 hover:-translate-y-1 transition-all duration-300"
          >
            <Plus className="w-5 h-5" />
            Add Brand
          </button>
        </div>

        {/* Glass Card */}
        <div className="bg-zinc-900/60 backdrop-blur-xl border border-zinc-800 shadow-2xl rounded-3xl overflow-hidden">
          <div className="p-8">
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : brands.length === 0 ? (
              <div className="text-center py-12 text-zinc-400">
                <p className="text-lg">No brands found. Add your first brand!</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-zinc-800">
                      <th className="pb-4 font-semibold text-zinc-300">Brand Name</th>
                      <th className="pb-4 font-semibold text-zinc-300 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {brands.map((brand) => (
                      <tr key={brand.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition-colors duration-200">
                        <td className="py-4 font-medium text-zinc-200">{brand.name}</td>
                        <td className="py-4 text-right">
                          <button
                            onClick={() => handleOpenModal(brand)}
                            className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors mr-2 cursor-pointer"
                            title="Edit"
                          >
                            <Pencil className="w-5 h-5" />
                          </button>
                          <button
                            onClick={() => handleDelete(brand.id)}
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-950/60 backdrop-blur-sm transition-opacity duration-300">
          <div className="bg-zinc-900/80 backdrop-blur-xl border border-zinc-700 w-full max-w-md rounded-3xl shadow-2xl p-8 transform transition-all scale-100">
            <h2 className="text-2xl font-bold text-zinc-100 mb-6">
              {editingBrand ? "Edit Brand" : "Add New Brand"}
            </h2>
            {error && (
              <div className="mb-4 p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-xl text-sm">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-6">
                <label className="block text-sm font-medium text-zinc-300 mb-2">Brand Name</label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-zinc-950/50 border border-zinc-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none transition-all placeholder-zinc-500 text-zinc-100"
                  placeholder="e.g. Apple, Samsung"
                />
              </div>
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-6 py-2.5 rounded-xl font-medium text-zinc-400 hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-medium bg-blue-600 text-white hover:bg-blue-500 shadow-lg shadow-blue-500/25 transition-all cursor-pointer"
                >
                  {editingBrand ? "Save Changes" : "Create Brand"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
