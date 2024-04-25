import { useEffect } from 'react';
import { useLocation, useHistory } from 'react-router';

const useConfirmationOnUnload = (unsavedCondition) => {
    const prevLocation = useLocation().pathname;
    const history = useHistory();

    const message = 'Changes that you made may not be saved.';

    useEffect(() => {
        const handleBeforeUnload = (event) => {
            if (unsavedCondition) {
                (event || window.event).returnValue = message;
                return message;
            }
        };

        window.addEventListener('beforeunload', handleBeforeUnload);

        return () => {
            window.removeEventListener('beforeunload', handleBeforeUnload);
        };
    }, [unsavedCondition]);

    useEffect(() => {
        const unblock = history.block((location, action) => {
            if (unsavedCondition && location.pathname !== prevLocation) {
                const response = window.confirm(message);
                if (!response) {
                    // Resetting the URL
                    if (action === 'POP') {
                        history.goForward();
                    } else if (action === 'PUSH') {
                        history.goBack();
                    }
                }
                return response;
            }
            return true;
        });

        return () => {
            unblock();
        };
    }, [unsavedCondition]);

    return null;
};

const ConfirmationOnUnload = ({ condition }) => {
    useConfirmationOnUnload(condition);
    return null;
};

export default ConfirmationOnUnload;
