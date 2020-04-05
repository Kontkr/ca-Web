import React from 'react';
import { Button } from 'antd';

export function WrapButton(props) {
    const onClick = e => {
        console.log(props)
        props.onClick(props, e);
    }

    return (
        <Button type={props.type ? props.type : ''} onClick={onClick} icon={props.icon} >
            {props.name}
        </Button >
    );
}