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
      alert(err instanceof Error ? err.message : "Failed to save product.");
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
    if (!confirm("Delete product?")) return;
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
      alert(err instanceof Error ? err.message : "Failed to update stock.");
    } finally {
      setUpdatingStockId(null);
    }
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Product Management</h1>

      <div className="mb-6 grid grid-cols-3 gap-3 rounded-xl bg-white p-4 shadow">
        {formKeys.map((key) => (
          <Input
            key={key}
            placeholder={key}
            value={form[key]}
            onChange={(e) => handleChange(key, e.target.value)}
          />
        ))}

        <Button onClick={handleSubmit} className="col-span-3">
          {editingId ? "Update Product" : "Create Product"}
        </Button>
      </div>

      <div className="rounded-xl bg-white shadow">
        {products.map((product) => {
          const stock = Number(product.stock) || 0;
          const stockBusy = updatingStockId === product._id;

          return (
            <div key={product._id} className="flex items-center justify-between border-b p-3">
              <div className="flex items-center gap-3">
                <img src={product.image} className="h-12 w-12" />
                <div>
                  <div className="font-semibold">
                    {product.brand} {product.model || product.title}
                  </div>
                  <div className="text-sm text-gray-500">{product.dimensions}</div>
                </div>
              </div>

              <div>{product.price} kr</div>

              <div className="flex items-center gap-2">
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

              <div className="flex gap-2">
                <Button onClick={() => handleEdit(product)}>Edit</Button>
                <Button variant="destructive" onClick={() => void handleDelete(product._id)}>
                  Delete
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
