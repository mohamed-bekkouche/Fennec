import React, { Component, type ErrorInfo, type ReactNode } from "react";
import { FaExclamation } from "react-icons/fa6";
import { HiArrowPath } from "react-icons/hi2";

interface ErrorBoundaryProps {
  children: ReactNode;
  FallbackComponent?: React.ComponentType<FallbackProps>;
  onReset?: () => void;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export interface FallbackProps {
  error: Error | null;
  errorInfo: ErrorInfo | null;
  resetErrorBoundary: () => void;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    };
  }

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  resetErrorBoundary = () => {
    this.props.onReset?.();
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      const { FallbackComponent } = this.props;

      if (FallbackComponent) {
        return (
          <FallbackComponent
            error={this.state.error}
            errorInfo={this.state.errorInfo}
            resetErrorBoundary={this.resetErrorBoundary}
          />
        );
      }

      return (
        <DefaultErrorFallback
          error={this.state.error}
          errorInfo={this.state.errorInfo}
          resetErrorBoundary={this.resetErrorBoundary}
        />
      );
    }

    return this.props.children;
  }
}

// Default fallback component that can be used as a template for custom ones
const DefaultErrorFallback: React.FC<FallbackProps> = ({
  error,
  errorInfo,
  resetErrorBoundary,
}) => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4">
    <div className="w-full max-w-md bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="bg-gradient-to-r from-rose-500 to-pink-600 p-6 flex items-center space-x-4">
        <FaExclamation className="h-10 w-10 text-white" />
        <h1 className="text-xl font-bold text-white">Something went wrong</h1>
      </div>

      <div className="p-6 space-y-4">
        <div className="space-y-2">
          <h2 className="text-lg font-semibold text-gray-800">
            {error?.name || "Error"}
          </h2>
          <p className="text-sm text-gray-600">
            {error?.message || "An unexpected error occurred"}
          </p>
        </div>

        {errorInfo?.componentStack && (
          <details className="border border-gray-200 rounded-lg overflow-hidden">
            <summary className="bg-gray-50 px-4 py-2 text-sm font-medium text-gray-700 cursor-pointer">
              Error Details
            </summary>
            <pre className="p-4 text-xs text-gray-600 bg-gray-50 overflow-x-auto">
              {errorInfo.componentStack}
            </pre>
          </details>
        )}

        <button
          onClick={resetErrorBoundary}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-blue-600 hover:from-indigo-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-sm hover:shadow-md"
        >
          <HiArrowPath className="h-5 w-5" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  </div>
);

export default ErrorBoundary;
