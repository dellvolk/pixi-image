import React, {Component} from 'react';
// import classes from './Images.module.scss'
import {connect} from "react-redux";
import ImagesCards from "./components/ImagesCards/ImagesCards";
import {
    SET_IMAGES_INITIAL_STATES,
    SET_IMAGES_LOADER,
    SET_IS_MODAL_ADD_CREATIVE_OPEN
} from "../../store/actions/actions";
import {fetchDeleteSelectedImage, fetchGetImages, getNextImagesPage} from "../../store/actions/imagesActionCreator";
import queryString from "query-string";
import {getFilters} from "../../utils/functions";
import {fetchGetCreative, fetchSetCreative} from "../../store/actions/creativesActionCreator";
import {withRouter} from "react-router-dom";
import Clients from "../Clients/Clients";
import FormAddCreative from "../../containers/FormAddCreative/FormAddCreative";
import HeaderPanel from "../../containers/HeaderPanel/HeaderPanel";


const filterKeys = ['ordering', 'search'];

class Images extends Component {

    state = {};

    componentDidMount() {
        const parsed = queryString.parse(this.props.location.search);
        this.props.getImages({creative: this.props.match.params.creativeId, ...getFilters(filterKeys, parsed)})
        this.handleSetCreative(this.props.match.params.creativeId);
    }

    handleScrollPosBtn = (event) => {
        if (event.target.offsetHeight + event.target.scrollTop === event.target.scrollHeight && this.props.pagination.next) {
            this.props.getNextPage(this.props.pagination);
        }
    };


    handleSetCreative = id => {
        if (this.props.creatives.length === 0) {
            this.props.getCreative(id)
        } else {
            this.props.creatives.forEach(item => {
                if (item.id.toString() === id.toString()) {
                    this.props.setCreative({...item});
                }
            })
        }
    };

    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScrollPosBtn);
        this.props.setInitialStates();
    }


    componentDidUpdate(prevProps) {
        const match = this.props.match;
        const prevMatch = prevProps.match;
        const parsed = queryString.parse(this.props.location.search);
        const prevParsed = queryString.parse(prevProps.location.search);
        if (match.params.creativeId !== prevMatch.params.creativeId || JSON.stringify(getFilters(filterKeys, parsed)) !== JSON.stringify(getFilters(filterKeys, prevParsed))) {
            console.log(this.props.match.params.creativeId);
            this.props.getImages({client: this.props.match.params.creativeId, ...getFilters(filterKeys, parsed)})
            // this.props.getCreatives({client: this.props.match.params.clientId})
        }
    }

    handleOpenCreativeBuilder = () => {
        this.props.history.push(`/creative/${this.props.creative.id}/builder`);
    };

    render() {
        const {images, creative, loader} = this.props;
        return (
            <Clients>
                <FormAddCreative/>
                <HeaderPanel match={this.props.match} creative={creative}/>
                <ImagesCards data={images}
                             handleDeleteImages={(images_id) => this.props.deleteImages(images, images_id)}
                             handleOpenModal={() => this.props.setIsModalAddCreativeOpen(2)}
                             handleOpenCreativeBuilder={this.handleOpenCreativeBuilder}
                             handleScrollImage={this.handleScrollPosBtn}
                             loader={loader}
                />
            </Clients>
        );
    }
}

function mapStateToProps(state) {
    return {
        images: state.images.images,
        creative: state.creatives.creative,
        creatives: state.creatives.creatives,
        loader: state.images.loader,
        pagination: state.images.pagination,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getImages: params => dispatch(fetchGetImages(params)),
        setCreative: payload => dispatch(fetchSetCreative(payload)),
        getCreative: id => dispatch(fetchGetCreative(id)),
        deleteImages: (prevImages, images_id) => dispatch(fetchDeleteSelectedImage(prevImages, images_id)),
        setIsModalAddCreativeOpen: payload => dispatch({type: SET_IS_MODAL_ADD_CREATIVE_OPEN, payload}),
        setInitialStates: () => dispatch({type: SET_IMAGES_INITIAL_STATES}),
        setLoader: payload => dispatch({type: SET_IMAGES_LOADER, payload}),
        getNextPage: pagination => dispatch(getNextImagesPage(pagination)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Images));