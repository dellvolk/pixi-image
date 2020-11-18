import React, {useState} from 'react';
import classes from './Auth.module.scss'
import { Form, Typography, Input } from "antd";
import axios from "../../axios/axios";
import {AUTH_JWT_CREATE} from "../../utils/api";
import {connect} from "react-redux";
import {fetchUserAuth} from "../../store/actions/authActionCreator";
import {showErrorMessage} from "../../utils/helpers";

const {Title} = Typography;

const emailFieldName = 'email';
const passwordFieldName = 'password';

const Auth = props => {

    const [fields, setFields] = useState({
        [emailFieldName]: {
            error: {
                hasFeedback: true,
                validateStatus: "initial",
                // help: "Link on photo",
            },
            placeholder: "nickname",
            value: '',
            type: 'text'
        },
        [passwordFieldName]: {
            error: {
                hasFeedback: true,
                validateStatus: "initial",
                // help: "Link on photo",
            },
            type: 'password',
            placeholder: 'password',
            value: '',
        },
    });

    const onChangeEmailField = value => {
        // const res = emailValidator(value);
        let data = {...fields};
        data[emailFieldName] = {
            ...data[emailFieldName],
            value,
            error: {
                hasFeedback: true,
                // validateStatus: res ? 'success' : 'error',
                // help: !res && 'Email is not valid'
            }
        };
        setFields(data);
    };

    const onChangePasswordField = value => {
        let data = {...fields};
        data[passwordFieldName] = {
            ...data[passwordFieldName],
            value,
        };
        setFields(data);
    };

    const handleClickLogin = () => {
        axios
            .post(AUTH_JWT_CREATE, {
                username: fields[emailFieldName].value,
                password: fields[passwordFieldName].value,
            })
            .then(res => {
                props.handleAuth(res)
            })
            .catch(e => showErrorMessage(e))
    };

    return (
        <div className={classes.Auth}>
            <div className={classes.form}>
                <Title align="center" level={5}>Welcome to Advaice!</Title>
                <div className={classes.content}>
                    <Form>
                        <Form.Item {...fields[emailFieldName].error}>
                            <Input placeholder={fields[emailFieldName].placeholder}
                                   type={fields[emailFieldName].type}
                                   value={fields[emailFieldName].value}
                                   onChange={e => onChangeEmailField(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item {...fields[passwordFieldName].error}>
                            <Input placeholder={fields[passwordFieldName].placeholder}
                                   type={fields[passwordFieldName].type}
                                   value={fields[passwordFieldName].value}
                                   onChange={e => onChangePasswordField(e.target.value)}
                            />
                        </Form.Item>
                        <Form.Item>
                            <button className={classes.btnLogin} onClick={handleClickLogin}>Start</button>
                        </Form.Item>
                    </Form>
                </div>
            </div>
        </div>
    );
};

function mapDispatchToProps(dispatch) {
    return {
        handleAuth: res => dispatch(fetchUserAuth(res))
    }
}

export default connect(null, mapDispatchToProps)(Auth)