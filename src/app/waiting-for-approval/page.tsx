"use client";

import React from "react";
import { Clock, CheckCircle2 } from "lucide-react";

const steps = [
  { label: "Additional info", status: "Pending approval" },
  { label: "Vehicle info", status: "Pending approval" },
  { label: "Personal info", status: "Pending approval" },
  { label: "Training", status: "Approved" },
  { label: "Create account", status: "Approved" },
];

const Page = () => {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 px-6 py-12">
      <div className="max-w-md w-full">
        {/* Header Section */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            Thanks for registering!
          </h1>
          <p className="text-gray-600 tracking-tight text-sm mt-2">
            It only takes <b>1–2 business days</b> to verify your account after you complete the
            process. Be a <b>1 Market Philippines Partner Driver</b> to start earning and get rewards.
          </p>
        </div>

        {/* Completed Steps */}
        <h2 className="text-gray-800 font-semibold mb-3">Completed steps</h2>

        <div className="space-y-3">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex justify-between items-center rounded-lg border p-4 shadow-sm ${
                step.status === "Approved"
                  ? "bg-green-50 border-green-200"
                  : "bg-white border-gray-200"
              }`}
            >
              <div>
                <p
                  className={`text-xs font-medium ${
                    step.status === "Approved"
                      ? "text-green-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.status}
                </p>
                <p className="text-gray-800 font-semibold">{step.label}</p>
              </div>
              {step.status === "Approved" ? (
                <CheckCircle2 className="text-green-500 w-5 h-5" />
              ) : (
                <Clock className="text-gray-400 w-5 h-5" />
              )}
            </div>
          ))}
        </div>

        <p className="text-xs text-gray-400 text-center mt-8">
          © {new Date().getFullYear()} 1 Market Philippines. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default Page;
