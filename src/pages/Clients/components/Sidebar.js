import React from 'react';
import {Layout, Menu, Modal} from "antd";
import styled from "styled-components";
import ExclamationCircleOutlined from "@ant-design/icons/lib/icons/ExclamationCircleOutlined";
import { NavLink} from "react-router-dom";
import style from "./Sidebar.module.scss";
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";

const {Sider} = Layout;

const Sidebar = (props) => {
    const { data, client } = props;
    const [touched, setTouched] = React.useState(false);
    const [name, setName] = React.useState('');

    React.useEffect(() => {
        setTouched(false);
        setName('');
    }, [data])

    const handleAddClient = e => {
        e.preventDefault();
        props.addClient(data, {
            name,
            description: ''
        });
    };

    const handleDellClient = id => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined/>,
            content: 'Do you want to delete this client?',
            okText: 'Delete',
            cancelText: 'Cancel',
            onOk: () => props.handleDeleteClient(id)
        });
    };

    return (
        <Sider width={200}
               style={{background: "#fff"}}
               className="site-layout-background"
            // collapsible
            //    collapsed={collapsed}
        >
            <div className='sidebar__btn-add-new-client' onClick={() => setTouched(true)}>
                {!touched ?
                    <>
                        <p>Add client</p>
                        <svg width="24" height="24" viewBox="0 0 24 24" focusable="false" role="presentation">
                            <path
                                d="M13 11V3.993A.997.997 0 0 0 12 3c-.556 0-1 .445-1 .993V11H3.993A.997.997 0 0 0 3 12c0 .557.445 1 .993 1H11v7.007c0 .548.448.993 1 .993.556 0 1-.445 1-.993V13h7.007A.997.997 0 0 0 21 12c0-.556-.445-1-.993-1H13z"
                                fill="currentColor" fill-rule="evenodd"/>
                        </svg>
                    </> :
                    <form onSubmit={handleAddClient}>
                        <input type="text"
                               value={name}
                               id='input-add-client'
                               className='sidebar__input-add-new-client'
                               placeholder='Client name'
                               autoFocus
                               onBlur={() => setTouched(false)}
                               onChange={e => setName(e.target.value)}/>
                    </form>
                }
            </div>
            <LayoutMenu
                mode="inline"
                selectedKeys={[client && client.toString()]}
                style={{borderRight: 0}}
            >
                {data && data.map((i, index) => <div key={i.id} className={style.sidebar__container}>
                        <NavLink onClick={() => props.handleSetClient(data[index])} to={`/client/${i.id}`} activeClassName={style.active_sidebar}> {i.name} </NavLink>
                        <div className={style.delete__client}> <DeleteOutlined onClick={() => handleDellClient(i.id)} /> </div>
                    </div>
                )}
                <div className={style.sidebar_footer}>
                   <div className={style.conditions}>
                       Privacy Policy / Terms of Conditions
                   </div>
                    <div className={style.helpDesk}>
                        Help desk
                    </div>
                </div>
            </LayoutMenu>
        </Sider>
    );
};

const LayoutMenu = styled(Menu)`
    li:first-child {
      padding-top: 0;
      margin-top: 0;
    }
`;

export default Sidebar