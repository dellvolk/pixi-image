import React, {useState} from 'react';
import classes from './FormCreateCreative.module.scss'
import {Form, Input} from "antd";
import {postCreativeAPI} from "../../../../store/api/api";
import {showErrorMessage} from "../../../../utils/helpers";

const FormCreateCreative = props => {
    const { client, handleAddCreative } = props;
    const [name, setName] = useState('');
    // const [redirect, setRedirect] = useState('');

    const handleNextStep = () => {
        postCreativeAPI({
                name,
                "client": client
            })
            .then(res => {
                handleAddCreative(res.data);
                props.href(`/creative/${res.data.id}`)
            })
            .catch(e => showErrorMessage(e))
    };

    const handleKeyPressed = () => {
        return handleNextStep();
    }

    return (
        <div className={classes.FormCreateCreative}>
            <Form layout="vertical">
                <Form.Item label='Name'>
                    <Input value={name} onPressEnter={handleKeyPressed} onChange={e => setName(e.target.value)}/>
                </Form.Item>
            </Form>
            <div className={classes.btnCreateCreative} onClick={handleNextStep}>
                <button className="custom-btn">
                    Next
                </button>
            </div>
        </div>
    );
};

export default (FormCreateCreative)