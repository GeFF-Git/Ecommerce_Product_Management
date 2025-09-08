import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProductsList from '@/components/products/ProductsList';
import ProductForm from '@/components/products/ProductForm';
import ProductDetail from '@/components/products/ProductDetail';

const Products: React.FC = () => {
  return (
    <Routes>
      <Route index element={<ProductsList />} />
      <Route path="create" element={<ProductForm />} />
      <Route path=":id" element={<ProductDetail />} />
      <Route path=":id/edit" element={<ProductForm />} />
    </Routes>
  );
};

export default Products;