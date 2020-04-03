import React from 'react';
import { Button } from 'antd';

export function WrapButton(props) {
    const param = props.id;
    return (
        <Button onClick={e => props.onClick(param, e)} icon={props.icon} style={props.style}>{props.name}</Button >
    );
}