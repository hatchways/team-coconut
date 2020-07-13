//Player status in lobby

import React from 'react'
import CircularProgress from '@material-ui/core/CircularProgress';
import DoneIcon from '@material-ui/icons/Done';

function PlayerStatus({status}) {
    if(status === 'Invited'){
        return <CircularProgress size={24} />
    }else{
        return <DoneIcon />
    }
}

export default PlayerStatus;

