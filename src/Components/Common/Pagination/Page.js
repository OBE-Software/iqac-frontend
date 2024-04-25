import React, { Component } from 'react';
import cx from 'classnames';

export default class Page extends Component {
    static defaultProps = {
        activeClass: 'active',
        disabledClass: 'disabled',
        itemClass: undefined,
        linkClass: undefined,
        activeLinkCLass: undefined,
        isActive: false,
        isDisabled: false,
        href: '#'
    };

    handleClick(e) {
        const { isDisabled, pageNumber } = this.props;
        e.preventDefault();
        if (isDisabled) {
            return;
        }
        this.props.onClick(pageNumber);
    }

    render() {
        let {
            pageText,
            pageNumber,
            activeClass,
            itemClass,
            linkClass,
            activeLinkClass,
            disabledClass,
            isActive,
            isDisabled,
            href,
            ariaLabel,
            id
        } = this.props;

        const css = cx(itemClass, {
            [activeClass]: isActive,
            [disabledClass]: isDisabled
        });

        const linkCss = cx(linkClass, {
            [activeLinkClass]: isActive
        });

        return (
            <li className={css} onClick={this.handleClick.bind(this)}>
                <a className={linkCss} href={href} aria-label={ariaLabel} id={id}>
                    {pageText}
                </a>
            </li>
        );
    }
}
