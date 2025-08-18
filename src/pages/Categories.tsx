import React from 'react';
import { Routes, Route } from 'react-router-dom';
import CategoriesList from '@/components/categories/CategoriesList';
import CategoryForm from '@/components/categories/CategoryForm';

const Categories: React.FC = () => {
  return (
    <Routes>
      <Route index element={<CategoriesList />} />
      <Route path="create" element={<CategoryForm />} />
      <Route path="edit/:id" element={<CategoryForm />} />
    </Routes>
  );
};

export default Categories;