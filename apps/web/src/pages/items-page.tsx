import { useState } from 'react';
import type { WishlistItem } from '@wishlist/core';
import { Plus } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { FilterBar } from '@/components/filters/filter-bar';
import { SortSelect } from '@/components/filters/sort-select';
import { BudgetSummary } from '@/components/filters/budget-summary';
import { ItemList } from '@/components/items/item-list';
import { ItemDialog } from '@/components/items/item-dialog';
import { ItemSheet } from '@/components/items/item-sheet';
import { ItemDeleteDialog } from '@/components/items/item-delete-dialog';
import { ItemDetailDialog } from '@/components/items/item-detail-dialog';
import { ItemDetailSheet } from '@/components/items/item-detail-sheet';
import type { ItemFormData } from '@/components/items/item-form';
import { Button } from '@/components/ui/button';
import { useItems } from '@/hooks/use-items';
import { useCreateItem, useUpdateItem, useDeleteItem } from '@/hooks/use-item-mutations';
import { useFilters } from '@/hooks/use-filters';
import { useMediaQuery } from '@/hooks/use-media-query';

export function ItemsPage() {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const { filters, setFilter, clearFilters, sort, order, setSort } = useFilters();
  const { data, isLoading } = useItems(filters);
  const createMutation = useCreateItem();
  const updateMutation = useUpdateItem();
  const deleteMutation = useDeleteItem();

  const [formOpen, setFormOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<WishlistItem | undefined>();
  const [deletingItem, setDeletingItem] = useState<WishlistItem | undefined>();
  const [viewingItem, setViewingItem] = useState<WishlistItem | undefined>();

  const items = data?.items ?? [];

  const handleCreate = () => {
    setEditingItem(undefined);
    setFormOpen(true);
  };

  const handleEdit = (item: WishlistItem) => {
    setViewingItem(undefined);
    setEditingItem(item);
    setFormOpen(true);
  };

  const handleDelete = (item: WishlistItem) => {
    setDeletingItem(item);
  };

  const handleView = (item: WishlistItem) => {
    setViewingItem(item);
  };

  const handleFormSubmit = (formData: ItemFormData) => {
    if (editingItem) {
      updateMutation.mutate(
        { id: editingItem.id, data: formData },
        { onSuccess: () => setFormOpen(false) },
      );
    } else {
      createMutation.mutate(formData, {
        onSuccess: () => setFormOpen(false),
      });
    }
  };

  const handleDeleteConfirm = () => {
    if (!deletingItem) return;
    deleteMutation.mutate(deletingItem.id, {
      onSuccess: () => setDeletingItem(undefined),
    });
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-6 space-y-4">
        {/* Filters and sort */}
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <FilterBar
            filters={filters}
            onFilterChange={setFilter}
            onClear={clearFilters}
          />
          <div className="flex items-center gap-3">
            <SortSelect sort={sort} order={order} onSortChange={setSort} />
            {/* Desktop add button */}
            <Button onClick={handleCreate} className="hidden md:inline-flex">
              <Plus className="mr-2 h-4 w-4" />
              追加
            </Button>
          </div>
        </div>

        {/* Budget summary */}
        {!isLoading && <BudgetSummary items={items} />}

        {/* Item list */}
        <ItemList
          items={items}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleView}
        />
      </main>

      {/* Mobile FAB */}
      <Button
        onClick={handleCreate}
        size="icon"
        className="md:hidden fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg"
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* Desktop: Dialog / Mobile: Sheet for form */}
      {isDesktop ? (
        <ItemDialog
          open={formOpen}
          onOpenChange={setFormOpen}
          item={editingItem}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      ) : (
        <ItemSheet
          open={formOpen}
          onOpenChange={setFormOpen}
          item={editingItem}
          onSubmit={handleFormSubmit}
          isSubmitting={isSubmitting}
        />
      )}

      {/* Desktop: Dialog / Mobile: Sheet for detail view */}
      {isDesktop ? (
        <ItemDetailDialog
          open={!!viewingItem}
          onOpenChange={(open) => {
            if (!open) setViewingItem(undefined);
          }}
          item={viewingItem}
          onEdit={handleEdit}
        />
      ) : (
        <ItemDetailSheet
          open={!!viewingItem}
          onOpenChange={(open) => {
            if (!open) setViewingItem(undefined);
          }}
          item={viewingItem}
          onEdit={handleEdit}
        />
      )}

      {/* Delete confirmation */}
      <ItemDeleteDialog
        open={!!deletingItem}
        onOpenChange={(open) => {
          if (!open) setDeletingItem(undefined);
        }}
        itemName={deletingItem?.name ?? ''}
        onConfirm={handleDeleteConfirm}
        isDeleting={deleteMutation.isPending}
      />
    </div>
  );
}
