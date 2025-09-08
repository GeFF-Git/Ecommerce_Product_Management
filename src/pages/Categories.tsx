import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CategoriesList from '@/components/categories/CategoriesList';
import CategoryForm from '@/components/categories/CategoryForm';
import CategoryDetail from '@/components/categories/CategoryDetail';

const Categories: React.FC = () => {
  return (
    <Routes>
      <Route index element={<CategoriesList />} />
      <Route path="create" element={<CategoryForm />} />
      <Route path=":id" element={<CategoryDetail />} />
      <Route path=":id/edit" element={<CategoryForm />} />
    </Routes>
  );
};

export default Categories;