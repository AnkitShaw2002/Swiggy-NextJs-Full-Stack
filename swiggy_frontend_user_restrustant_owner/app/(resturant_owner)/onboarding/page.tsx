"use client";

import React from "react";
import { CheckCircle2, Clock } from "lucide-react";
import DetailsStep from "@/features/restaurant_owner/component/restaurant-onboarding/DetailsStep";
import DocumentsStep from "@/features/restaurant_owner/component/restaurant-onboarding/DocumentsStep";
import ContractStep from "@/features/restaurant_owner/component/restaurant-onboarding/ContractStep";
import { useOnboardingPage } from "@/features/hooks/owner/owner.hook";

export default function OnboardingPage() {
  const {
    currentStep,
    isLoading,
    prevStep,
    steps,
    detailsInitialData,
    documentsInitialData,
    contractInitialData,
    handleDetailsSubmit,
    handleDocumentsSubmit,
    handleContractSubmit,
  } = useOnboardingPage();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 md:p-10 text-gray-800">

      {/* Centered Container Wrapper */}
      <div className="w-full max-w-6xl bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row overflow-hidden">
        {/* Left Sidebar - Registration Steps */}
        <aside className="w-full md:w-72 bg-white border-b md:border-b-0 md:border-r border-gray-200 p-6 sm:p-8 flex flex-col justify-between shrink-0">
          <div>
            <h2 className="text-lg font-bold mb-6 text-gray-950">
              Registration Steps
            </h2>

            <div className="space-y-6 relative">
              {steps.map((step) => {
                const isCompleted = currentStep > step.id;
                const isInProgress = currentStep === step.id;
                const isPending = currentStep < step.id;

                return (
                  <div
                    key={step.id}
                    className={`flex items-start space-x-3 relative ${
                      isPending ? "opacity-60" : ""
                    }`}
                  >
                    {/* Step Icon Status */}
                    <div className="mt-0.5 shrink-0">
                      {isCompleted && (
                        <div className="text-green-500">
                          <CheckCircle2 className="w-5 h-5 fill-green-100" />
                        </div>
                      )}

                      {isInProgress && (
                        <div className="text-amber-500">
                          <Clock className="w-5 h-5" />
                        </div>
                      )}

                      {isPending && (
                        <div className="w-5 h-5 rounded-full border-2 border-gray-300 flex items-center justify-center text-xs font-semibold text-gray-500">
                          {step.id}
                        </div>
                      )}
                    </div>

                    {/* Step Info */}
                    <div>
                      <span className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
                        STEP {step.id}
                      </span>
                      <p
                        className={`text-sm ${
                          isInProgress
                            ? "font-bold text-gray-900"
                            : "font-medium text-gray-700"
                        }`}
                      >
                        {step.label}
                      </p>

                      {isCompleted && (
                        <p className="text-xs text-green-600 font-medium mt-0.5">
                          Completed
                        </p>
                      )}
                      {isInProgress && (
                        <p className="text-xs text-amber-600 font-medium mt-0.5">
                          In Progress
                        </p>
                      )}
                      {isPending && (
                        <p className="text-xs text-gray-400 font-medium mt-0.5">
                          Pending
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Main Form Content Area */}
        <main className="flex-1 p-6 sm:p-8 md:p-10">
          {currentStep === 1 && (
            <DetailsStep
              initialData={detailsInitialData}
              onNext={handleDetailsSubmit}
              loading={isLoading}
            />
          )}

          {currentStep === 2 && (
            <DocumentsStep
              initialData={documentsInitialData}
              onNext={handleDocumentsSubmit}
              onBack={prevStep}
              loading={isLoading}
            />
          )}

          {currentStep === 3 && (
            <ContractStep
              initialData={contractInitialData}
              onSubmit={handleContractSubmit}
              onBack={prevStep}
              loading={isLoading}
            />
          )}
        </main>
      </div>
    </div>
  );
}