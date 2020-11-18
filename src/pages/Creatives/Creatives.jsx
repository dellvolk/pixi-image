import React, {Component} from 'react';
// import classes from './Creatives.module.scss'
import {connect} from "react-redux";
import {fetchDeleteCreative, fetchGetCreatives} from "../../store/actions/creativesActionCreator";
import CreativeCards from "./components/CreativeCards/CreativeCards";
import queryString from "query-string";
import {getFilters} from "../../utils/functions";
import {SET_IS_MODAL_ADD_CREATIVE_OPEN} from "../../store/actions/actions";
import {withRouter} from "react-router-dom";
import Clients from "../Clients/Clients";
import FormAddCreative from "../../containers/FormAddCreative/FormAddCreative";
import HeaderPanel from "../../containers/HeaderPanel/HeaderPanel";

const filterKeys = ['ordering', 'search'];

class Creatives extends Component {
    state = {

    }

    componentDidMount() {
        const parsed = queryString.parse(this.props.location.search);
        this.props.getCreatives({client: this.props.match.params.clientId, ...getFilters(filterKeys, parsed)})
    }

    componentDidUpdate(prevProps) {
        const match = this.props.match;
        const prevMatch = prevProps.match;
        const parsed = queryString.parse(this.props.location.search);
        const prevParsed = queryString.parse(prevProps.location.search);
        if (match.params.clientId !== prevMatch.params.clientId || JSON.stringify(getFilters(filterKeys, parsed)) !== JSON.stringify(getFilters(filterKeys, prevParsed))) {
            this.props.getCreatives({client: match.params.clientId, ...getFilters(filterKeys, parsed)})
        }
    }

    render() {
        const {creatives} = this.props;

        return (
            <Clients>
                <FormAddCreative/>
                <HeaderPanel match={this.props.match}/>
                <CreativeCards data={creatives}
                               match={this.props.match}
                               handleDeleteCreative={index => this.props.deleteCreative(creatives, index)}
                               handleOpenModal={() => this.props.setIsModalAddCreativeOpen(1)}
                />
            </Clients>
        );
    }
}

function mapStateToProps(state) {
    return {
        creatives: state.creatives.creatives,
        // isModalAddCreativeOpen: state.creatives.isModalAddCreativeOpen
    }
}

function mapDispatchToProps(dispatch) {
    return {
        getCreatives: params => dispatch(fetchGetCreatives(params)),
        deleteCreative: (creatives, index) => dispatch(fetchDeleteCreative(creatives, index)),
        setIsModalAddCreativeOpen: payload => dispatch({type: SET_IS_MODAL_ADD_CREATIVE_OPEN, payload}),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Creatives));