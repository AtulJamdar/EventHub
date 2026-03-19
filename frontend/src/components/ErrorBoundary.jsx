import { Component } from 'react';
import { Button, Card, CardBody } from '@heroui/react';
import { FaTriangleExclamation } from 'react-icons/fa6';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught:', error, errorInfo);
  }

  resetError = () => {
    this.setState({ hasError: false, error: null });
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
          <Card className="bg-white/10 backdrop-blur-md border border-white/20 w-full max-w-md">
            <CardBody className="p-8 space-y-6 text-center">
              <FaTriangleExclamation className="text-5xl text-red-400 mx-auto" />
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">Something went wrong</h1>
                <p className="text-gray-400">
                  {this.state.error?.message || 'An unexpected error occurred'}
                </p>
              </div>
              <Button
                fullWidth
                className="bg-blue-600 hover:bg-blue-700 text-white"
                onClick={this.resetError}
              >
                Go Home
              </Button>
            </CardBody>
          </Card>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;