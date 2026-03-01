'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Save } from 'lucide-react';
import Link from 'next/link';
import { createItemSchema, type CreateItemInput } from '@/lib/validations/knowledge';

interface Category {
  id: string;
  name: string;
}

interface TagOption {
  id: string;
  name: string;
}

export default function EditKnowledgeItemPage() {
  const router = useRouter();
  const params = useParams();
  const itemId = params.id as string;

  const [categories, setCategories] = useState<Category[]>([]);
  const [allTags, setAllTags] = useState<TagOption[]>([]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateItemInput>({
    resolver: zodResolver(createItemSchema),
  });

  useEffect(() => {
    Promise.all([
      fetch('/api/knowledge/categories').then((r) => r.json()),
      fetch('/api/knowledge/tags').then((r) => r.json()),
    ]).then(([cats, tags]) => {
      setCategories(cats);
      setAllTags(tags);

      // Find the item across categories
      for (const cat of cats) {
        const item = cat.items?.find((i: { id: string }) => i.id === itemId);
        if (item) {
          reset({
            title: item.title,
            description: item.description || '',
            type: item.type,
            url: item.url,
            categoryId: cat.id,
            order: item.order,
          });
          setSelectedTags(item.tags?.map((t: { tagId: string }) => t.tagId) || []);
          break;
        }
      }
      setIsFetching(false);
    });
  }, [itemId, reset]);

  const onSubmit = async (data: CreateItemInput) => {
    setIsLoading(true);
    setError('');

    const res = await fetch(`/api/knowledge/items/${itemId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...data, tagIds: selectedTags }),
    });

    if (res.ok) {
      router.push('/admin/knowledge');
    } else {
      const result = await res.json();
      setError(result.error || 'שגיאה בעדכון הפריט');
    }
    setIsLoading(false);
  };

  const toggleTag = (tagId: string) => {
    setSelectedTags((prev) =>
      prev.includes(tagId) ? prev.filter((id) => id !== tagId) : [...prev, tagId]
    );
  };

  if (isFetching) {
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
        <h1 className="text-2xl font-bold text-gray-800">עריכת פריט ידע</h1>
      </div>

      <div className="card max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="p-4 bg-error-red/10 text-error-red rounded-lg text-sm font-medium">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="title" className="input-label">כותרת *</label>
            <input
              id="title"
              type="text"
              className={`input-field ${errors.title ? 'border-error-red' : ''}`}
              {...register('title')}
            />
            {errors.title && <p className="input-error">{errors.title.message}</p>}
          </div>

          <div>
            <label htmlFor="description" className="input-label">תיאור</label>
            <textarea
              id="description"
              rows={2}
              className="textarea-field"
              {...register('description')}
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="categoryId" className="input-label">קטגוריה *</label>
              <select
                id="categoryId"
                className={`select-field ${errors.categoryId ? 'border-error-red' : ''}`}
                {...register('categoryId')}
              >
                <option value="">בחר קטגוריה...</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              {errors.categoryId && <p className="input-error">{errors.categoryId.message}</p>}
            </div>

            <div>
              <label htmlFor="type" className="input-label">סוג תוכן *</label>
              <select
                id="type"
                className={`select-field ${errors.type ? 'border-error-red' : ''}`}
                {...register('type')}
              >
                <option value="">בחר סוג...</option>
                <option value="PDF">PDF</option>
                <option value="VIDEO">וידאו</option>
                <option value="LINK">קישור</option>
              </select>
              {errors.type && <p className="input-error">{errors.type.message}</p>}
            </div>
          </div>

          <div>
            <label htmlFor="url" className="input-label">כתובת URL *</label>
            <input
              id="url"
              type="text"
              className={`input-field ${errors.url ? 'border-error-red' : ''}`}
              placeholder="https://..."
              dir="ltr"
              {...register('url')}
            />
            {errors.url && <p className="input-error">{errors.url.message}</p>}
          </div>

          <div>
            <label className="input-label">תגיות</label>
            <div className="flex flex-wrap gap-2 mt-1">
              {allTags.map((tag) => (
                <button
                  key={tag.id}
                  type="button"
                  onClick={() => toggleTag(tag.id)}
                  className={`badge cursor-pointer transition-colors ${
                    selectedTags.includes(tag.id)
                      ? 'bg-ocean-blue text-white'
                      : 'badge-info hover:bg-ocean-blue hover:text-white'
                  }`}
                >
                  #{tag.name}
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex items-center gap-2"
            >
              {isLoading ? <span className="spinner" /> : <Save className="w-5 h-5" />}
              עדכון
            </button>
            <Link href="/admin/knowledge" className="btn-secondary">
              ביטול
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
