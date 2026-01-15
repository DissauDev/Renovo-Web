// src/routes/AppRouter.tsx
import { Routes, Route } from "react-router-dom";

import { LoginPage } from "../pages/auth/LoginPage";
import { DashboardLayout } from "../components/layout/DashboardLayout";
import ScrollToTop from "./ScrollToTop";
import { TicketsMainPage } from "../pages/tickets/TIcketsMainPage";
import { InvoicesPage } from "../pages/dashboard/InvoicesPage";
import { TechniciansPage } from "../pages/dashboard/technicians/TechniciansPage";
import { SettingsPage } from "../pages/dashboard/SettingsPage";
import { TicketsDetailsPage } from "../pages/tickets/TicketsDetailsPage";
import { CreateTicketPage } from "../pages/tickets/CreateTicketPage";
import { NewTechnicianPage } from "../pages/dashboard/technicians/NewTechnicianPage";

import { NewProvidersPage } from "../pages/dashboard/providers/NewProvidersPage";
import { ProvidersPage } from "../pages/dashboard/providers/ProvidersPage";
import { ProvidersDetails } from "../pages/dashboard/providers/ProvidersDetails";
import { TechniciansDetails } from "../pages/dashboard/technicians/TechniciansDetails";
import { MyUserDetails } from "../pages/dashboard/MyUserDetails";
import { ChangePasswordPage } from "../pages/dashboard/ChangePasswordPage";
import { ProductsPage } from "../pages/dashboard/products/ProductsPage";
import { CreateProductPage } from "../pages/dashboard/products/CreateProductPage";
import { ProductDetailPage } from "../pages/dashboard/products/ProductDetailsPage";
import { CategoriesPage } from "../pages/dashboard/categories/CategoriesPage";
import { CreateCategoryPage } from "../pages/dashboard/categories/CreateCategoryPage";
import { CategoryDetailPage } from "../pages/dashboard/categories/CategoriesDetails";
import { EditTicketPage } from "../pages/tickets/EditTicketPage";

export const AppRouter = () => {
  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Público */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/singin" element={<LoginPage />} />

        {/* Privado / Dashboard */}
        <Route path="/app" element={<DashboardLayout />}>
          {/* User */}
          <Route path="user/:id" element={<MyUserDetails />} />
          <Route
            path="user/:id/change-password"
            element={<ChangePasswordPage />}
          />

          {/* Tickets */}
          <Route
            path="tickets"
            element={<TicketsMainPage currentUserId="admin-1" />}
          />
          <Route path="tickets/new" element={<CreateTicketPage />} />
          <Route path="tickets/:id" element={<TicketsDetailsPage />} />
          <Route path="tickets/:id/edit" element={<EditTicketPage />} />

          <Route path="invoices" element={<InvoicesPage />} />
          {/* Technicians */}
          <Route path="technicians" element={<TechniciansPage />} />
          <Route path="technicians/new" element={<NewTechnicianPage />} />
          <Route path="technicians/:id" element={<TechniciansDetails />} />
          {/* Providers */}
          <Route path="providers" element={<ProvidersPage />} />
          <Route path="providers/new" element={<NewProvidersPage />} />
          <Route path="providers/:id" element={<ProvidersDetails />} />
          {/* Products */}
          <Route path="products" element={<ProductsPage />} />
          <Route path="products/new" element={<CreateProductPage />} />
          <Route path="products/:id" element={<ProductDetailPage />} />
          {/* Categoriess */}
          <Route path="categories" element={<CategoriesPage />} />
          <Route path="categories/new" element={<CreateCategoryPage />} />
          <Route path="categories/:id" element={<CategoryDetailPage />} />

          <Route path="settings" element={<SettingsPage />} />
        </Route>
      </Routes>
    </>
  );
};
