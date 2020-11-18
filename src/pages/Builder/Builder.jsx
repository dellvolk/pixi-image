import React, {Component} from 'react';
// import classes from './Builder.module.scss'
import {connect} from "react-redux";
import queryString from "query-string";
import {getFilters} from "../../utils/functions";
import {withRouter} from "react-router-dom";
import CreativeBuilder from "../../containers/CreativeBuilder/CreativeBuilder";
import Clients from "../Clients/Clients";
import FormAddCreative from "../../containers/FormAddCreative/FormAddCreative";
import {
    fetchGetImages, fetchGetTagsList, fetchGetTemplatesList, fetchSetImagesLoader,
    fetchSetInitialStates, getNextImagesPage
} from "../../store/actions/builderActionCreator";
import {fetchGetCreative, fetchSetCreative} from "../../store/actions/creativesActionCreator";
import {SET_IS_MODAL_ADD_CREATIVE_OPEN} from "../../store/actions/actions";
import {TEMPLATES_LIST} from "../../utils/templates-list";
import Builder from "../../Core/Builder";


const filterKeys = ['ordering', 'search'];

class _Builder extends Component {

    constructor(props) {
        super(props);
        this.canvasRef = React.createRef();
    }

    state = {};

    componentDidMount() {

        this.builder = new Builder(this.canvasRef, 800, 600);
        this.builder.setTemplate(TEMPLATES_LIST[4])

        this.props.getTags();

        let parsed = queryString.parse(this.props.location.search);

        if(!Array.isArray(parsed.tag)) {
                parsed.tag = [parsed.tag]
        }
        this.props.getTemplates({tag: parsed.tag.join(',')});

        this.props.getImages({creative: this.props.match.params.creativeId, ...getFilters(filterKeys, parsed)})
        this.handleSetCreative(this.props.match.params.creativeId);

        // window.addEventListener('scroll', this.handleScrollPosBtn);
    }

    // handleScrollPosBtn = () => {
    //     if (!this.state.isOpenCreativeBuilder && window.scrollY + window.innerHeight === document.body.scrollHeight && this.props.pagination.next) {
    //         this.props.getNextPage(this.props.pagination);
    //     }
    // };

    handleGetPagination = () => {
        if(!!this.props.pagination.next) {
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

    componentDidUpdate(prevProps) {
        const match = this.props.match;
        const prevMatch = prevProps.match;
        const parsed = queryString.parse(this.props.location.search);
        const prevParsed = queryString.parse(prevProps.location.search);
        if (match.params.creativeId !== prevMatch.params.creativeId || JSON.stringify(getFilters(filterKeys, parsed)) !== JSON.stringify(getFilters(filterKeys, prevParsed))) {
            this.props.getImages({client: this.props.match.params.creativeId, ...getFilters(filterKeys, parsed)})
        }
        if(JSON.stringify(parsed.tag) !== JSON.stringify(prevParsed.tag)) {
            // debugger;
            let {tag} = parsed;
            if(!Array.isArray(tag)) {
                tag = [tag]
            }
            this.props.getTemplates({tag: tag.join(',')});
        }
    }

    handleCloseCreativeBuilder = () => {
        this.props.history.push(`/creative/${this.props.creative?.id}`);
    };

    render() {
        const {images, creative, loader, templates, tags} = this.props;
        return (
            <Clients sidebar={false}>
                <FormAddCreative/>
                <CreativeBuilder creativeid={creative}
                                 imagesData={images}
                                 handleOpenModal={() => this.props.setIsModalAddCreativeOpen(2)}
                                 handleCloseCreativeBuilder={this.handleCloseCreativeBuilder}
                                 handleGetPagination={this.handleGetPagination}
                                 loader={loader}
                                 Builder={this.builder}
                                 canvasRef={this.canvasRef}
                                 templatesList={templates}
                                 tagsList={tags}
                />
            </Clients>
        );
    }
}

function mapStateToProps(state) {
    return {
        images: state.builder.images,
        creative: state.creatives.creative,
        creatives: state.creatives.creatives,
        loader: state.builder.loader,
        pagination: state.builder.pagination,
        templates: state.builder.templates,
        tags: state.builder.tags,
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getTags: params => dispatch(fetchGetTagsList(params)),
        getTemplates: params => dispatch(fetchGetTemplatesList(params)),
        getImages: params => dispatch(fetchGetImages(params)),
        setCreative: payload => dispatch(fetchSetCreative(payload)),
        getCreative: id => dispatch(fetchGetCreative(id)),
        setIsModalAddCreativeOpen: payload => dispatch({type: SET_IS_MODAL_ADD_CREATIVE_OPEN, payload}),
        setInitialStates: () => dispatch(fetchSetInitialStates()),
        setLoader: payload => dispatch(fetchSetImagesLoader(payload)),
        getNextPage: pagination => dispatch(getNextImagesPage(pagination)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(_Builder));