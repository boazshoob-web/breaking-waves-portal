'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Plus,
  Pencil,
  Trash2,
  FileText,
  Video,
  Link as LinkIcon,
  Search,
} from 'lucide-react';

interface TagRelation {
  tagId: string;
  tag: { id: string; name: string };
}

interface KnowledgeItem {
  id: string;
  title: string;
  description: string | null;
  type: string;
  url: string;
  order: number;
  tags: TagRelation[];
}

interface Category {
  id: string;
  name: string;
  icon: string | null;
  order: number;
  items: KnowledgeItem[];
}

function getTypeIcon(type: string) {
  switch (type) {
    case 'PDF':
      return <FileText className="w-4 h-4 text-error-red" />;
    case 'VIDEO':
      return <Video className="w-4 h-4 text-ocean-blue" />;
    case 'LINK':
      return <LinkIcon className="w-4 h-4 text-success-green" />;
    default:
      return <FileText className="w-4 h-4" />;
  }
}

export default function AdminKnowledgePage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
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

  const handleDeleteItem = async (itemId: string) => {
    const res = await fetch(`/api/knowledge/items/${itemId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setDeleteId(null);
      fetchCategories();
    }
  };

  const allItems = categories.flatMap((cat) =>
    cat.items.map((item) => ({ ...item, categoryName: cat.name }))
  );

  const filteredItems = search
    ? allItems.filter(
        (item) =>
          item.title.includes(search) ||
          item.categoryName.includes(search) ||
          item.tags.some((t) => t.tag.name.includes(search))
      )
    : allItems;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <span className="spinner" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">ניהול מאגר ידע</h1>
        <Link href="/admin/knowledge/new" className="btn-primary flex items-center gap-2">
          <Plus className="w-5 h-5" />
          פריט חדש
        </Link>
      </div>

      {/* Search */}
      <div className="card mb-6">
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="חיפוש לפי כותרת, קטגוריה או תגית..."
            className="input-field pr-10"
          />
        </div>
      </div>

      {/* Items Table */}
      <div className="card overflow-x-auto">
        <table className="table">
          <thead>
            <tr>
              <th>כותרת</th>
              <th>קטגוריה</th>
              <th>סוג</th>
              <th>תגיות</th>
              <th>פעולות</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((item) => (
              <tr key={item.id}>
                <td>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(item.type)}
                    <span className="font-medium">{item.title}</span>
                  </div>
                </td>
                <td>{item.categoryName}</td>
                <td>
                  <span className="badge badge-info text-xs">{item.type}</span>
                </td>
                <td>
                  <div className="flex flex-wrap gap-1">
                    {item.tags.map((t) => (
                      <span key={t.tagId} className="text-xs text-gray-500">
                        #{t.tag.name}
                      </span>
                    ))}
                  </div>
                </td>
                <td>
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/admin/knowledge/${item.id}/edit`}
                      className="p-2 text-gray-500 hover:text-ocean-blue hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <Pencil className="w-4 h-4" />
                    </Link>
                    {deleteId === item.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="text-xs px-2 py-1 bg-error-red text-white rounded"
                        >
                          אישור
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
                        onClick={() => setDeleteId(item.id)}
                        className="p-2 text-gray-500 hover:text-error-red hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filteredItems.length === 0 && (
          <p className="text-center text-gray-500 py-8">
            {search ? 'לא נמצאו תוצאות' : 'אין פריטים במאגר הידע'}
          </p>
        )}
      </div>
    </div>
  );
}
