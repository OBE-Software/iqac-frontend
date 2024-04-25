import { Component } from 'react';
import Error500 from '../../pages/Errors/Error500';

const ErrorView = ({ error, errorInfo }) => <Error500 error={error} errorInfo={errorInfo} />;

export default class ErrorBoundary extends Component {
    constructor(props) {
        super(props);
        this.state = { error: null, errorInfo: null };
    }

    componentDidCatch(error, errorInfo) {
        // Catch errors in any components below and re-render with error message
        this.setState({
            error: error,
            errorInfo: errorInfo
        });
        // You can also log error messages to an error reporting service here
    }

    render() {
        const { error, errorInfo } = this.state;

        if (errorInfo) {
            // Error path
            return <ErrorView {...{ error, errorInfo }} />;
        } else {
            // Normally, just render children
            return this.props.children;
        }
    }
}
