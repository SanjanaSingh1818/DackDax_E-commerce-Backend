"use client";

import { useEffect, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { productAPI } from "@/lib/api";

type Product = {
  _id: string;
  url?: string;
  title?: string;
  brand?: string;
  model?: string;
  season?: string;
  dimensions?: string;
  width?: number;
  profile?: number;
  diameter?: number;
  size_index?: string;
  ean?: string | number;
  availability?: string;
  fuel_rating?: string;
  wet_rating?: string;
  noise_rating?: string | number;
  price?: number;
  stock?: number;
  image?: string;
};

type ProductForm = {
  url: string;
  title: string;
  brand: string;
  model: string;
  season: string;
  dimensions: string;
  width: string;
  profile: string;
  diameter: string;
  size_index: string;
  ean: string;
  availability: string;
  fuel_rating: string;
  wet_rating: string;
  noise_rating: string;
  price: string;
  stock: string;
  image: string;
};

const emptyForm: ProductForm = {
  url: "",
  title: "",
  brand: "",
  model: "",
  season: "",
  dimensions: "",
  width: "",
  profile: "",
  diameter: "",
  size_index: "",
  ean: "",
  availability: "",
  fuel_rating: "",
  wet_rating: "",
  noise_rating: "",
  price: "",
  stock: "10",
  image: "",
};

export default function AdminProductsPage() {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : "";

  const [products, setProducts] = useState<Product[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [updatingStockId, setUpdatingStockId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(emptyForm);

  useEffect(() => {
    void loadProducts();
  }, []);

  async function loadProducts() {
    const res = await productAPI.getAll({ limit: 200 });
    setProducts(Array.isArray(res.products) ? (res.products as Product[]) : []);
  }

  const formKeys = useMemo(() => Object.keys(form) as Array<keyof ProductForm>, [form]);

  function handleChange(key: keyof ProductForm, value: string) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit() {
    try {
      const parsedStock = Number(form.stock);
      const data = {
        ...form,
        width: Number(form.width),
        profile: Number(form.profile),
        diameter: Number(form.diameter),
        noise_rating: Number(form.noise_rating),
        price: Number(form.price),
        ean: Number(form.ean),
        stock: Number.isFinite(parsedStock) ? Math.max(0, Math.floor(parsedStock)) : 10,
      };

      if (editingId) {
        await productAPI.update(editingId, data, token || "");
      } else {
        await productAPI.create(data, token || "");
      }

      resetForm();
      await loadProducts();
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Kunde inte spara produkt.");
    }
  }

  function handleEdit(product: Product) {
    setEditingId(product._id);
    setForm({
      url: product.url || "",
      title: product.title || "",
      brand: product.brand || "",
      model: product.model || "",
      season: product.season || "",
      dimensions: product.dimensions || "",
      width: String(product.width || ""),
      profile: String(product.profile || ""),
      diameter: String(product.diameter || ""),
      size_index: product.size_index || "",
      ean: String(product.ean || ""),
      availability: product.availability || "",
      fuel_rating: product.fuel_rating || "",
      wet_rating: product.wet_rating || "",
      noise_rating: String(product.noise_rating || ""),
      price: String(product.price || ""),
      stock: String(product.stock ?? 10),
      image: product.image || "",
    });
  }

  async function handleDelete(id: string) {
    if (!confirm("Ta bort produkten?")) return;
    await productAPI.delete(id, token || "");
    await loadProducts();
  }

  async function handleAdjustStock(product: Product, delta: number) {
    const current = Number(product.stock) || 0;
    const next = Math.max(0, current + delta);
    if (next === current) return;

    try {
      setUpdatingStockId(product._id);
      await productAPI.update(product._id, { stock: next }, token || "");
      setProducts((prev) => prev.map((item) => (item._id === product._id ? { ...item, stock: next } : item)));
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Kunde inte uppdatera lagersaldo.");
    } finally {
      setUpdatingStockId(null);
    }
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <h1 className="text-xl font-bold sm:text-2xl">Produkthantering</h1>

      <div className="grid grid-cols-1 gap-3 rounded-xl bg-white p-3 shadow sm:grid-cols-2 sm:p-4 lg:grid-cols-3">
        {formKeys.map((key) => (
          <Input
            key={key}
            placeholder={key}
            value={form[key]}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        ))}

        <Button onClick={handleSubmit} className="w-full sm:col-span-2 lg:col-span-3">
          {editingId ? "Uppdatera produkt" : "Skapa produkt"}
        </Button>
      </div>

      <div className="overflow-x-auto rounded-xl bg-white shadow">
        {products.map((product) => {
          const stock = Number(product.stock) || 0;
          const stockBusy = updatingStockId === product._id;

          return (
            <div
              key={product._id}
              className="flex min-w-[760px] items-center justify-between gap-4 border-b p-3"
            >
              <div className="flex min-w-[250px] items-center gap-3">
                <img src={product.image} className="h-12 w-12" />
                <div>
                  <div className="font-semibold">
                    {product.brand} {product.model || product.title}
                  </div>
                  <div className="text-sm text-gray-500">{product.dimensions}</div>
                </div>
              </div>

              <div className="min-w-[90px] text-sm font-medium">{product.price} kr</div>

              <div className="flex min-w-[120px] items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  disabled={stockBusy || stock <= 0}
                  onClick={() => void handleAdjustStock(product, -1)}
                >
                  -
                </Button>
                <span className="min-w-10 text-center text-sm font-medium">{stock}</span>
                <Button
                  size="sm"
                  variant="outline"
                  disabled={stockBusy}
                  onClick={() => void handleAdjustStock(product, 1)}
                >
                  +
                </Button>
              </div>

              <div className="flex min-w-[140px] gap-2">
                <Button onClick={() => handleEdit(product)}>Redigera</Button>
                <Button variant="destructive" onClick={() => void handleDelete(product._id)}>
                  Ta bort
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
