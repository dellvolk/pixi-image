import React from 'react';
import FormCreateCreative from "./FormCreateCreative/FormCreateCreative";
import FormUploadImage from "../../../containers/FormUploadImage/FormUploadImage";
import {withRouter} from "react-router-dom";

const ModalSwitcher = props => {
    const {step, handleAddCreative, handleAddImages} = props;
    const {clientId, creativeId} = props.match.params;
    // console.log(props);
    // React.useEffect(() => {
    //     console.log('step changed', step)
    //     if(step === 2 && !creativeId) {
    //         props.go(`/client/${clientId}/creative/${}`)
    //     }
    // }, [step, creativeId]);
    console.log(props.match.params);
    return (
        <>
            {step === 1
                ? <FormCreateCreative handleAddCreative={handleAddCreative}
                                      client={clientId}
                                      href={props.history.push}
                />
                : <FormUploadImage creative={creativeId}
                                   handleAddImages={handleAddImages}
                                   setLoader={props.setLoader}
                                   setIsModalAddCreativeOpen={props.setIsModalAddCreativeOpen}
                />}
        </>
    );
};

export default withRouter(ModalSwitcher)