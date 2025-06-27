import React, {Component} from 'react';

const RenderChildrenFunction: React.FC<{ children?: React.ReactNode | (() => React.ReactNode) }> = ({ children }) => (
  typeof children === 'function' ? (children as () => React.ReactNode)() : children
);

interface ErrorBoundaryState {
  hasError: boolean;
};

interface ErrorBoundaryProps {
  children: React.ReactNode | (() => React.ReactNode),    
  onError?: (error: any) => void
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false
    }
  }

  componentDidCatch(error: any) {
    const {onError} = this.props;
    this.setState({hasError: true});
    if (onError) {
      onError(error);
    }
  }

  render() {
    const {children} = this.props;
    const {hasError} = this.state;
    return !hasError && <RenderChildrenFunction>{children}</RenderChildrenFunction>;
  }
}

export default ErrorBoundary;