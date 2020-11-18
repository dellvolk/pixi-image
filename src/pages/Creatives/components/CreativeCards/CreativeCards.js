import React from 'react';
import classes from './CreativeCards.module.scss'
import DeleteOutlined from "@ant-design/icons/lib/icons/DeleteOutlined";
import {Modal} from "antd";
import ExclamationCircleOutlined from "@ant-design/icons/lib/icons/ExclamationCircleOutlined";
import {Link} from "react-router-dom";
import FilterPanel from "../../../../containers/Filters/FilterPanel/FilterPanel";

const initialFilter = {
    type: 'name',
    sort: '',
    search: '',
};

const menu = [
    {key: 'name', label: 'name'},
    {key: 'created', label: 'created'},
    {key: 'modified', label: 'modified'},
];

const CreativeCards = props => {
    const {data, handleDeleteCreative, handleOpenModal} = props;

    const confirmDeleteCreative = (item, index) => {
        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined/>,
            content: 'Do you want to delete creative?',
            okText: 'Delete',
            cancelText: 'Cancel',
            onOk: () => handleDeleteCreative(index)
        });
    };

    return (
        <>
            <div className={classes.headerPanel}>
                <button onClick={handleOpenModal} className='custom-btn'><i className="fas fa-folder-plus"
                                                                            style={{margin: '0 5px'}}/> Add creative
                </button>
                <FilterPanel initialFilter={initialFilter}
                             dropdown={menu}
                />
            </div>
            <div className={classes.cards}>
                {data && data.map((i, index) => {
                    return (
                        <div key={index + 'imgSd'} title={i.name} className={classes.imageCard}>
                            <Link to={`/creative/${i.id}`} >
                                <i className="fas fa-folder"/>
                                <p>{i.name}</p>
                            </Link>
                            <DeleteOutlined className={classes.deleteBtn}
                                            onClick={() => confirmDeleteCreative(i, index)}/>
                        </div>
                    )
                })}
            </div>
        </>
    );
};

export default CreativeCards