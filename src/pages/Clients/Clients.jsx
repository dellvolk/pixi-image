import React, {Component} from 'react';
// import classes from './Clients.module.scss'
import Layout from "../../components/Layout/Layout";
import {connect} from "react-redux";
import {
    fetchAddClient, fetchDellClient,
    fetchGetClient,
    fetchGetClients,
    fetchSetClient
} from "../../store/actions/clientsActionCreator";
import {withRouter} from "react-router-dom";
import {getCreativeAPI} from "../../store/api/api";
import Sidebar from "./components/Sidebar";

class Clients extends Component {
    state = {}

    componentDidMount() {
        if (this.props.clients.length === 0) {
            this.props.getClients();
        }
        if (!!this.props.match.params.clientId) {
            this.handleSetClient(this.props.match.params.clientId)
        }
        if(!!this.props.match.params.creativeId) {
            getCreativeAPI(this.props.match.params.creativeId)
                .then(res => this.handleSetClient(res.data.client))
                .catch(e => {
                    this.props.history.push('/clients');
                });
        }
    }

    handleSetClient = id => {
        if (this.props.clients.length === 0) {
            this.props.getClient(id)
        } else {
            this.props.clients.forEach(item => {
                if (item.id.toString() === id.toString()) {
                    this.props.setClient({...item});
                }
            })
        }
    };


    render() {
        const {clients, client, sidebar = true} = this.props;
        return (
            <React.Fragment>
                <Layout sidebar={sidebar && <Sidebar data={clients}
                                                           client={client?.id}
                                                           addClient={this.props.addClient}
                                                           handleSetClient={this.props.setClient}
                                                           handleDeleteClient={this.props.deleteClient}
                />}>
                    {this.props.children}
                </Layout>
            </React.Fragment>
        );
    }
}

export const mapStateToProps = state => ({
    clients: state.clients.clients,
    client: state.clients.client,
});

export const mapDispatchToProps = dispatch => ({
    deleteClient: id => dispatch(fetchDellClient(id)),
    getClients: () => dispatch(fetchGetClients()),
    getClient: id => dispatch(fetchGetClient(id)),
    setClient: payload => dispatch(fetchSetClient(payload)),
    addClient: (prevClients, payload) => dispatch(fetchAddClient(prevClients, payload)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Clients));