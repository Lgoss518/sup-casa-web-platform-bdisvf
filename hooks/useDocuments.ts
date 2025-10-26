
import { useState, useEffect } from 'react';
import { Document, DocumentFilter } from '@/types/Document';
import { mockDocuments } from '@/data/mockDocuments';

export function useDocuments() {
  const [documents, setDocuments] = useState<Document[]>(mockDocuments);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>(mockDocuments);
  const [filter, setFilter] = useState<DocumentFilter>({});

  useEffect(() => {
    applyFilters();
  }, [filter, documents]);

  const applyFilters = () => {
    let filtered = [...documents];

    if (filter.level) {
      filtered = filtered.filter(doc => doc.level === filter.level);
    }

    if (filter.subject) {
      filtered = filtered.filter(doc => doc.subject === filter.subject);
    }

    if (filter.type) {
      filtered = filtered.filter(doc => doc.type === filter.type);
    }

    if (filter.searchQuery && filter.searchQuery.trim() !== '') {
      const query = filter.searchQuery.toLowerCase();
      filtered = filtered.filter(doc =>
        doc.title.toLowerCase().includes(query) ||
        doc.subject.toLowerCase().includes(query) ||
        doc.description?.toLowerCase().includes(query)
      );
    }

    setFilteredDocuments(filtered);
  };

  const addDocument = (document: Document) => {
    setDocuments(prev => [document, ...prev]);
  };

  const updateFilter = (newFilter: Partial<DocumentFilter>) => {
    setFilter(prev => ({ ...prev, ...newFilter }));
  };

  const clearFilters = () => {
    setFilter({});
  };

  return {
    documents: filteredDocuments,
    allDocuments: documents,
    filter,
    updateFilter,
    clearFilters,
    addDocument,
  };
}
