"use client";

import { ProtectedRoute } from "@/components/auth/ProtectedRoute";
import { RecommendationFeed } from "@/components/recommendations/RecommendationFeed";

const DashboardPage = () => {
  return (
    <ProtectedRoute>
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <RecommendationFeed />
      </div>
    </ProtectedRoute>
  );
};

export default DashboardPage;
