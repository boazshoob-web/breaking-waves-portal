'use client';

import { useState, useEffect } from 'react';
import { Plus, Pencil, Trash2, Save, X, ArrowRight } from 'lucide-react';
import Link from 'next/link';

interface Category {
  id: string;
  name: string;
  icon: string | null;
  order: number;
  items: { id: string }[];
}

export default function CategoriesManagementPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editId, setEditId] = useState<string | null>(null);
  const [editName, setEditName] = useState('');
  const [editIcon, setEditIcon] = useState('');
  const [newName, setNewName] = useState('');
  const [newIcon, setNewIcon] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    const res = await fetch('/api/knowledge/categories');
    if (res.ok) {
      setCategories(await res.json());
    }
    setIsLoading(false);
  };

  const handleCreate = async () => {
    if (!newName.trim()) return;
    const res = await fetch('/api/knowledge/categories', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newName,
        icon: newIcon || undefined,
        order: categories.length + 1,
      }),
    });
    if (res.ok) {
      setNewName('');
      setNewIcon('');
      setShowNew(false);
      fetchCategories();
    }
  };

  const handleUpdate = async (id: string) => {
    const res = await fetch(`/api/knowledge/categories/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: editName, icon: editIcon || undefined }),
    });
    if (res.ok) {
      setEditId(null);
      fetchCategories();
    }
  };

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/knowledge/categories/${id}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setDeleteId(null);
      fetchCategories();
    }
  };

  const startEdit = (cat: Category) => {
    setEditId(cat.id);
    setEditName(cat.name);
    setEditIcon(cat.icon || '');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link
          href="/admin/knowledge"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">ניהול קטגוריות</h1>
      </div>

      <div className="card max-w-2xl">
        <div className="space-y-3">
          {categories.map((cat) => (
            <div
              key={cat.id}
              className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
            >
              {editId === cat.id ? (
                <>
                  <input
                    type="text"
                    value={editIcon}
                    onChange={(e) => setEditIcon(e.target.value)}
                    className="w-12 text-center input-field !p-2"
                    placeholder="🔷"
                  />
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="flex-1 input-field !p-2"
                  />
                  <button
                    onClick={() => handleUpdate(cat.id)}
                    className="p-2 text-success-green hover:bg-green-50 rounded-lg"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setEditId(null)}
                    className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <span className="text-2xl w-10 text-center">{cat.icon}</span>
                  <span className="flex-1 font-medium">{cat.name}</span>
                  <span className="text-sm text-gray-500">
                    {cat.items.length} פריטים
                  </span>
                  <button
                    onClick={() => startEdit(cat)}
                    className="p-2 text-gray-500 hover:text-ocean-blue hover:bg-gray-100 rounded-lg"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  {deleteId === cat.id ? (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleDelete(cat.id)}
                        className="text-xs px-2 py-1 bg-error-red text-white rounded"
                      >
                        מחק
                      </button>
                      <button
                        onClick={() => setDeleteId(null)}
                        className="text-xs px-2 py-1 bg-gray-200 rounded"
                      >
                        ביטול
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setDeleteId(cat.id)}
                      className="p-2 text-gray-500 hover:text-error-red hover:bg-gray-100 rounded-lg"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </>
              )}
            </div>
          ))}
        </div>

        {/* New Category */}
        {showNew ? (
          <div className="flex items-center gap-3 p-3 mt-3 bg-ocean-blue/5 rounded-lg border-2 border-dashed border-ocean-blue">
            <input
              type="text"
              value={newIcon}
              onChange={(e) => setNewIcon(e.target.value)}
              className="w-12 text-center input-field !p-2"
              placeholder="🔷"
            />
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="flex-1 input-field !p-2"
              placeholder="שם הקטגוריה..."
              autoFocus
            />
            <button
              onClick={handleCreate}
              className="p-2 text-success-green hover:bg-green-50 rounded-lg"
            >
              <Save className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                setShowNew(false);
                setNewName('');
                setNewIcon('');
              }}
              className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowNew(true)}
            className="flex items-center gap-2 mt-4 text-ocean-blue hover:underline font-medium"
          >
            <Plus className="w-4 h-4" />
            קטגוריה חדשה
          </button>
        )}
      </div>
    </div>
  );
}
