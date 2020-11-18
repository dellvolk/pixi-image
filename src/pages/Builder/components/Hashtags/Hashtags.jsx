import React from 'react';
import classes from './Hashtags.module.scss'
import {Link} from "react-router-dom";

const Hashtags = ({data}) => {
    return (
        <div className={classes.Hashtags}>
            <div>
            {data.map(i => (
                <Link to={`?tag=${i.name}`}><span> #{i.name}</span></Link>
            ))}
            </div>
        </div>
    );
};

export default Hashtags