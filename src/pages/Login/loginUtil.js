import { superAdminSidePanelData } from '../../Layouts/layoutUtils';

export const navigateToFirstRouteAfterLogin = (permissionData, addCurrentNavToStore, addCurrentSubNavToStore, navigate) => {
    if (permissionData?.length) {
        const findFirstModule = permissionData?.find(
            (per) => per?.actions?.view === 1 || per?.actions?.create === 1 || per?.actions?.edit === 1 || per?.actions?.delete === 1
        );
        if (!findFirstModule) return false;

        let subModule = null;
        const findSideNavItem = superAdminSidePanelData.find((side) => {
            if (side?.subItems?.length) {
                if (side.subItems.find((sub) => sub.label === findFirstModule.module))
                    subModule = side.subItems.find((sub) => sub.label === findFirstModule.module);
                return side.subItems.find((sub) => sub.label === findFirstModule.module);
            } else {
                return side.label === findFirstModule.module;
            }
        });
        if (!findSideNavItem) return false;

        if (subModule) {
            navigate(subModule.link);
            addCurrentNavToStore(findSideNavItem.label);
            addCurrentSubNavToStore(subModule.label);
            return true;
        } else {
            navigate(findSideNavItem.link);
            addCurrentNavToStore(findSideNavItem.label);
            addCurrentSubNavToStore('');
            return true;
        }
    }

    return false;
};
export const updateActiveNavInSidebar = (location, addCurrentNavToStore, addCurrentSubNavToStore) => {
    const pathname = location.pathname;

    let subModule = null;
    const findSideNavItem = superAdminSidePanelData.find((side) => {
        if (side?.subItems?.length) {
            if (side.subItems.find((sub) => sub.link === pathname)) subModule = side.subItems.find((sub) => sub.link === pathname);
            return side.subItems.find((sub) => sub.link === pathname);
        } else {
            return side.link === pathname;
        }
    });
    if (!findSideNavItem) return false;

    if (subModule) {
        addCurrentNavToStore(findSideNavItem.label);
        addCurrentSubNavToStore(subModule.label);
        return true;
    } else {
        addCurrentNavToStore(findSideNavItem.label);
        addCurrentSubNavToStore('');
        return true;
    }
};
