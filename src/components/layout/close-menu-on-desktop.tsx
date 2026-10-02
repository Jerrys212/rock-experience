"use client";

import { useEffect } from "react";

const DESKTOP_QUERY = "(min-width: 64rem)";

type CloseMenuOnDesktopProps = {
    menuId: string;
};

export function CloseMenuOnDesktop({ menuId }: CloseMenuOnDesktopProps) {
    useEffect(() => {
        const desktop = window.matchMedia(DESKTOP_QUERY);
        const closeMenu = () => {
            const menu = document.getElementById(menuId);
            if (desktop.matches && menu?.matches(":popover-open")) menu.hidePopover();
        };

        desktop.addEventListener("change", closeMenu);
        return () => desktop.removeEventListener("change", closeMenu);
    }, [menuId]);

    return null;
}
