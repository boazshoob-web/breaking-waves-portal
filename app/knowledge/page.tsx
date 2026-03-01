import { FileText, Video, Link as LinkIcon, ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import { Suspense } from 'react';
import prisma from '@/lib/db/prisma';
import SearchBar from './SearchBar';
import FilterPanel from './FilterPanel';

interface Props {
  searchParams: { q?: string; type?: string; tag?: string };
}

function highlightText(text: string, query: string) {
  if (!query) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-yellow-200 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

function getItemIcon(type: string) {
  switch (type) {
    case 'PDF':
      return <FileText className="w-5 h-5 text-error-red" />;
    case 'VIDEO':
      return <Video className="w-5 h-5 text-ocean-blue" />;
    case 'LINK':
      return <LinkIcon className="w-5 h-5 text-success-green" />;
    default:
      return <FileText className="w-5 h-5" />;
  }
}

export default async function KnowledgePage({ searchParams }: Props) {
  const { q, type, tag } = searchParams;

  // Fetch tags for filter panel
  const tags = await prisma.tag.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { items: true } } },
  });

  // Build item filter conditions
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const itemWhere: any = {};
  if (q) {
    itemWhere.OR = [
      { title: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ];
  }
  if (type) {
    itemWhere.type = type;
  }
  if (tag) {
    itemWhere.tags = {
      some: { tag: { name: tag } },
    };
  }

  const hasItemFilters = Object.keys(itemWhere).length > 0;

  // Fetch categories with filtered items
  const categories = await prisma.knowledgeCategory.findMany({
    orderBy: { order: 'asc' },
    include: {
      items: {
        where: hasItemFilters ? itemWhere : undefined,
        orderBy: { order: 'asc' },
        include: {
          tags: { include: { tag: true } },
        },
      },
    },
  });

  // Filter out empty categories when search/filter is active
  const hasFilters = q || type || tag;
  const visibleCategories = hasFilters
    ? categories.filter((cat) => cat.items.length > 0)
    : categories;

  const totalItems = visibleCategories.reduce(
    (sum, cat) => sum + cat.items.length,
    0
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <div className="page-header">
        <div className="container">
          <h1 className="page-title">מאגר ידע</h1>
          <p className="page-subtitle">
            כל המידע, הנהלים והכלים שאתם צריכים - במקום אחד
          </p>
        </div>
      </div>

      <div className="container py-8">
        {/* Search and Filters */}
        <div className="card mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <Suspense fallback={<div className="flex-1 h-12 bg-gray-100 rounded-lg animate-pulse" />}>
              <SearchBar />
            </Suspense>
          </div>

          <div className="mt-4">
            <Suspense fallback={null}>
              <FilterPanel tags={tags} />
            </Suspense>
          </div>
        </div>

        {/* Search Results Info */}
        {hasFilters && (
          <div className="mb-6 text-sm text-gray-600">
            {totalItems > 0 ? (
              <span>
                נמצאו <strong>{totalItems}</strong> תוצאות
                {q && <> עבור &quot;<strong>{q}</strong>&quot;</>}
                {tag && <> בתגית <strong>#{tag}</strong></>}
                {type && <> מסוג <strong>{type}</strong></>}
              </span>
            ) : (
              <span>לא נמצאו תוצאות. נסו לשנות את החיפוש או הסינון.</span>
            )}
          </div>
        )}

        {/* Categories */}
        <div className="space-y-8">
          {visibleCategories.map((category) => (
            <div key={category.id} className="card">
              <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-200">
                <span className="text-3xl">{category.icon}</span>
                <h2 className="text-2xl font-bold text-gray-800">
                  {category.name}
                </h2>
                <span className="badge badge-info mr-auto">
                  {category.items.length} פריטים
                </span>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                {category.items.map((item) => (
                  <a
                    key={item.id}
                    href={item.url}
                    target={item.type === 'LINK' ? '_blank' : undefined}
                    rel={item.type === 'LINK' ? 'noopener noreferrer' : undefined}
                    className="flex items-center gap-3 p-4 bg-gray-50 hover:bg-ocean-blue/5 rounded-lg border border-gray-200 hover:border-ocean-blue transition-all group"
                  >
                    <div className="flex-shrink-0">
                      {getItemIcon(item.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-800 group-hover:text-ocean-blue transition-colors truncate">
                        {q ? highlightText(item.title, q) : item.title}
                      </p>
                      {item.description && (
                        <span className="text-xs text-ocean-blue font-semibold">
                          {item.description}
                        </span>
                      )}
                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {item.tags.map((t) => (
                            <span
                              key={t.tagId}
                              className="text-xs text-gray-500"
                            >
                              #{t.tag.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <ChevronLeft className="w-5 h-5 text-gray-400 group-hover:text-ocean-blue transition-colors flex-shrink-0" />
                  </a>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* About Section */}
        <div className="card mt-8 bg-gradient-to-l from-ocean-blue/5 to-transparent border-r-4 border-ocean-blue">
          <h3 className="text-xl font-bold mb-3">אודות העמותה</h3>
          <p className="text-gray-700 leading-relaxed">
            עמותת &quot;שוברים גלים&quot; היא עמותה שיקומית לנפגעי נפש באמצעות שייט ימי.
            אנו מספקים טיפול רה אביליטציה ייחודי המשלב את כוחות הים והשייט
            לסייע במסע השיקום והחזרה לחיים תקינים.
          </p>
          <Link
            href="/about"
            className="inline-block mt-4 text-ocean-blue font-semibold hover:underline"
          >
            קרא עוד על העמותה →
          </Link>
        </div>
      </div>
    </div>
  );
}
