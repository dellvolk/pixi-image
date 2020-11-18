import React from "react";
import classes from "./ImagesHeaderPanel.module.scss";
import IconCrateCrative from "../../../../../assets/IconCreateCreative.svg";
import svgLine from "../../../../../assets/svgGreyLine.svg";
import {Modal, Tooltip} from "antd";
import IconsMark from "../../../../../assets/Mark.svg";
import IconUpload from "../../../../../assets/IconUpload.svg";
import FilterPanel from "../../../../../containers/Filters/FilterPanel/FilterPanel";
import IconUnMark from "../../../../../assets/UnMark.svg";
import IconTrashBox from "../../../../../assets/trash.svg";
import IconsDownload from "../../../../../assets/IconsDownload.svg";
import ExclamationCircleOutlined from "@ant-design/icons/lib/icons/ExclamationCircleOutlined";

const ImagesHeaderPanel = (props) => {

    const {
        handleDeleteImages,
        handleGetOpenCreativeBuilder,
        handleUnmarkAllImages,
        handleOpenModal,
        handleDownloadImages,
        handleClickCard,
        initialFilter,
        setData,
        menu,
        count,
        data
    } = props;

    const handleShowDownloadOrUnmark = (cnt) => {
        // Child to buttons panel
        return (<>
            <Tooltip placement="bottom" title={'Unmark'}>
                <div className={classes.iconsContainer}>
                    <img src={IconUnMark} className={classes.header__icons} alt="" onClick={handleUnmarkAllImages}/>
                </div>
            </Tooltip>

            <Tooltip placement="bottom" title={`Delete ${cnt} images`} >
                <div className={classes.iconsContainer}>
                    <img src={IconTrashBox}  className={classes.header__icons} alt="" onClick={confirmDeleteSelectedImages} />
                </div>
            </Tooltip>

            <Tooltip placement="bottom" title={`Download ${cnt} images`}>
                <div className={classes.iconsContainer}>
                    <img src={IconsDownload} className={classes.header__icons} alt="" onClick={handleDownloadImages}/>
                </div>
            </Tooltip>
        </>)
    };

    const handleMarkAllImages = () => {
        // Mark all images
        let dt = data.concat([]);
        for (let i = 0; i < dt.length; i++) {
            handleClickCard(i);
            dt[i].checked = true;
            setData(dt);
        }
    };


    const confirmDeleteSelectedImages = () => {

        let item = [];
        data.forEach(i => i.checked && item.push(i.id));

        Modal.confirm({
            title: 'Confirm',
            icon: <ExclamationCircleOutlined/>,
            content: 'Do you want to delete selected images?',
            okText: 'Delete',
            cancelText: 'Cancel',
            onOk: () => handleDeleteImages(item)
        });

    }

    return <>

        <div className={classes.headerPanel}>
            <div>
                {/* Buttons panel */}
                <div className={classes.buttonsPanel}>

                    <button onClick={handleGetOpenCreativeBuilder}
                            className='custom-btn'>
                        <img src={IconCrateCrative}
                             style={{width: "20px", height: "auto", margin: '0 5px', color: 'white'}} alt=""/>
                        Creative builder
                    </button>

                    <img src={svgLine} style={{width: '28px', height: 'auto', margin: '0 5px'}} alt=""/>

                    {count > 0 ? handleShowDownloadOrUnmark(count) :
                        <Tooltip placement="bottom" title={'Mark images'}>
                            <div className={classes.iconsContainer}>
                                <img src={IconsMark} className={classes.header__icons} alt=""
                                     onClick={handleMarkAllImages}/>
                            </div>
                        </Tooltip>}

                    <Tooltip placement="bottom" title={'Upload images'}>
                        <div className={classes.iconsContainer}>
                            <img src={IconUpload} className={classes.header__icons} alt=""
                                 onClick={handleOpenModal}/>
                        </div>
                    </Tooltip>

                </div>

            </div>

            <FilterPanel initialFilter={initialFilter}
                         dropdown={menu}
            />

        </div>

    </>
};

export default ImagesHeaderPanel;