import React from 'react';
import classes from './ImagesCards.module.scss'
import ArrowsAltOutlined from "@ant-design/icons/lib/icons/ArrowsAltOutlined";
import EditOutlined from "@ant-design/icons/lib/icons/EditOutlined";
import {message, Modal, Image, Space, Spin} from 'antd'
import ImageEditor from "../../../../containers/ImageEditor/ImageEditor";
import {getImageAPI, getImagesArchive} from "../../../../store/api/api";
import {dataURLtoFile, showErrorMessage} from "../../../../utils/helpers";
import axios from "../../../../axios/axios";
import styled from "styled-components";

import ImagesHeaderPanel from "./ImagesHeaderPanel/ImagesHeaderPanel";
import SelectedMark from "../../../../components/icons/SelectedMark";

const initialFilter = {
    type: 'created',
    sort: '',
    search: '',
};

const menu = [
    {key: 'created', label: 'created'},
];

const ImagesCards = props => {
    const {handleOpenModal, handleOpenCreativeBuilder, handleDeleteImages, handleScrollImage, loader} = props;

    const [imageEdit, setImageEdit] = React.useState(false);
    const [data, setData] = React.useState(null);
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
        setData(props.data);
        setCount(0);
    }, [props.data]);

    const handleSaveImageAfterEdit = () => {
        let canvas = document.getElementsByClassName('lower-canvas')[0];
        const image = dataURLtoFile(canvas.toDataURL('image/jpeg'), imageEdit.name);
        const formData = new FormData();
        formData.append('image', image);
        axios
            .patch('/images/' + imageEdit.id + '/save/',
                // name: 's',
                formData
                , {
                    headers: {
                        'accept': '*/*',
                        'Content-Type': 'multipart/form-data'
                    }
                })
            .then(res => {
                console.log(res);
                setImageEdit(false);
                message.success('Images successfully edited')
            })
            .catch(e => showErrorMessage(e))
    };

    const handleDownloadImages = () => {
        let images_id = [];
        data.forEach(i => i.checked && images_id.push(i.id));
        console.log(images_id);
        if (images_id.length > 0) {
            getImagesArchive({
                images_id: images_id.join(','),
                type: 'zip'
            })
                .then(res => {
                    window.location.href = res.data.url;
                })
                .catch(e => showErrorMessage(e));
        }
    };

    const handleEditCard = (item) => {
        // header('Cache-Control: no-cache, no-store, must-revalidate'); // HTTP 1.1.
        // header('Pragma: no-cache'); // HTTP 1.0.
        // header('Expires: 0'); // Proxies.
        handleUnmarkAllImages();
        getImageAPI(item.id).then(res => {
            console.log(res.data.base64);
            setImageEdit(res.data);
        }).catch(e => showErrorMessage(e));
    };

    const handleClickCard = index => {
        // Marked selected cards and start counting selected images
        let dt = data.concat([]);
        dt[index].checked = !dt[index].checked;
        dt.selected_images = dt.filter((x) => {
            return x.checked === true
        }).length;
        setCount(dt.selected_images);
        setData(dt);
    };


    const handlePreviewImage = index => {
        const el = document.getElementById('img-card-' + index);
        try {
            el.click();
        } catch (e) {
            console.error(e)
        }
    };

    const handleGetOpenCreativeBuilder = () => {
        handleUnmarkAllImages()
        handleOpenCreativeBuilder()
    }

    const handleUnmarkAllImages = () => {
        //Unmark all images
        let dt = data.concat([]);
        for (let i = 0; i < dt.length; i++) {
            handleClickCard(i);
            dt[i].checked = false;
            setData(dt);
        }
        setCount(0);
    };

    return (
        <>

            <ImagesHeaderPanel
                handleUnmarkAllImages={handleUnmarkAllImages}
                handleDeleteImages={handleDeleteImages}
                handleClickCard={handleClickCard}
                handleGetOpenCreativeBuilder={handleGetOpenCreativeBuilder}
                handleDownloadImages={handleDownloadImages}
                handleOpenModal={handleOpenModal}
                initialFilter={initialFilter}
                setData={setData}
                data={data}
                menu={menu}
                count={count}
            />

            <div className={classes.item_image} onScroll={(e) => handleScrollImage(e)}>

                <div className={classes.cards}>
                    {data && data.map((i, index) => {
                        return (
                            <div key={index + 'imgSd'} title={i.name}
                                 className={[i.checked && classes.imageCard_checked, classes.imageCard].join(' ')}>
                                {/* Enable checked mark */}
                                {[i.checked ?
                                    <SelectedMark selected={true}/> : <SelectedMark selected={false}/>
                                ]}
                                {/* Mark checked image*/}
                                <ImageStyled
                                    id={'img-card-' + index}
                                    alt={i.name}
                                    src={i.url}
                                    className={i.checked && classes.selectedImage}
                                    fallback="data:image/png;base64,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"
                                />
                                <div className={classes.hoverImage}>
                                    <div className={classes.clickHandlerImage} onClick={() => handleClickCard(index)}/>
                                    <EditOutlined onClick={() => handleEditCard(i)}/>
                                    <ArrowsAltOutlined onClick={() => handlePreviewImage(index)}/>
                                </div>

                            </div>
                        )
                    })}
                </div>

                {loader && <div className={classes.footerLoader}>
                    <Space size="large">
                        <Spin size="large"/>
                    </Space>
                </div>}

            </div>
            {/* Open modal after pressed "Edit" btn */}
            <Modal
                title="Image editor"
                visible={!!imageEdit}
                width={1048}
                onOk={handleSaveImageAfterEdit}
                onCancel={() => setImageEdit(false)}
            >
                {!!imageEdit && <ImageEditor src={'data:image/jpeg;base64,' + imageEdit.base64}/>}
            </Modal>

        </>
    );
};

const ImageStyled = styled(Image)`
    .ant-image-img {
        width: auto;
    }
`;


export default ImagesCards
