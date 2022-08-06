import React, {FunctionComponent} from 'react';
import {Card, Grid} from "@mui/material";
import StatCards from "../dashboard/shared/StatCards";
import StatCards2 from "../dashboard/shared/StatCards2";
import {Subtitles, Title} from "@mui/icons-material";

interface OwnProps {
}

type Props = OwnProps;

const Account: FunctionComponent<Props> = (props) => {

    return (
        <>
            <Grid container spacing={3}>
                <Grid item lg={8} md={8} sm={12} xs={12}>
                    <StatCards/>
                </Grid>
            </Grid>
        </>
    )
};

export default Account;

