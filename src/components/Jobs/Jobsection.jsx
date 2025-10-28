// src/components/JobPortal.jsx
import React, { useState } from "react";
import { Briefcase, Search, Filter, Grid3X3, Edit, Plus } from "lucide-react";

import AllJobs from "./AllJobs";
import Categories from "./Categories";
import ManageJobs from "./ManageJobs";
import SubmitJob from "./SumbitJob";

export default function Jobsection() {
  const [activeTab, setActiveTab] = useState("all");

  const tabs = [
    { id: "all", label: "All Jobs", Icon: Briefcase },
    { id: "categories", label: "Categories", Icon: Grid3X3 },
    { id: "manage", label: "Manage", Icon: Edit },
    { id: "submit", label: "Submit", Icon: Plus },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case "all": return <AllJobs />;
      case "categories": return <Categories />;
      case "manage": return <ManageJobs />;
      case "submit": return <SubmitJob />;
      default: return <AllJobs />;
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Tab Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex gap-1">
            {tabs.map((tab) => {
              const Icon = tab.Icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    flex items-center gap-2 px-5 py-3 text-sm font-medium transition-all
                    ${activeTab === tab.id
                      ? "border-b-2 border-purple-600 text-purple-600"
                      : "text-gray-600 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {renderContent()}
      </div>
    </div>
  );
}