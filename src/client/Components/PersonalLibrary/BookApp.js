import React from 'react'
import Helmet from 'react-helmet'
import Grid from '@material-ui/core/Grid'
import Tooltip  from '@material-ui/core/Tooltip';
import {withStyles} from '@material-ui/core/styles'
import ContactSupport from '@material-ui/icons/ContactSupport'
import NoteAdd from '@material-ui/icons/NoteAdd'
import BookContainer from './BookContainer'
import {
  PersonalLibraryProvider,
  PersonalLibraryContext
} from '../../contexts/PersonalLibraryContext'

import BookDrawerInfo from './BookDrawerInfo'
import BookDrawer from './BookDrawer';


const styles = theme => ({
  root: {
    padding: theme.spacing.unit
  },
  buttonInfo: {
    zIndex: 1,
    width: 36,
    height: 36,
    margin: theme.spacing.unit,
    border: '3px solid #73AD21'
  },
  icon: {
    margin: '0 auto',
    fontSize: 32
  },
  righticon:{
    position:'absolute',
    marginTop:theme.spacing.unit*2,
    right:'30px',
    '-webkit-transform': 'translateY(-50%)',
    '-ms-transform': 'translateY(-50%)',
     'transform': 'translateY(-50%)',
    fontSize:32,
    
  }
})

const BookApp = props => {
  const {classes} = props
  return (
    <div>
      <Helmet
        title="Super Duper Personal library"
        meta={[
          {
            name: 'description',
            content: 'freeCodeCamp ISQA Challenges Personal Library'
          },
          {
            name: 'keywords',
            content: 'react,fcc,challenges,isqa,personal library'
          }
        ]}
      />
      <PersonalLibraryProvider>
        <PersonalLibraryContext.Consumer>
          {({getLibraryData, isError, changeInfoDrawer, drawerInfoOpen,drawerOpen,changeDrawerStatus}) => (
            <div>
              <BookDrawerInfo
                onInfoOpen={changeInfoDrawer}
                infoOpen={drawerInfoOpen}
              />
              <div>
                <BookDrawer bookaddOpen={drawerOpen} bookaddVisibility={changeDrawerStatus}/>
              </div>
              <div className={classes.root}>
                <BookContainer appError={isError} getdata={getLibraryData} />
              </div>
              <Grid container spacing={8}>
                <Grid item xs={8}>
                  <Tooltip title="Show endpoints">
                      <ContactSupport className={classes.icon} onClick={() => changeInfoDrawer()}/>
                  </Tooltip>
                  
                </Grid>
                <Grid item xs={4}>
                  <div style={{align:'right'}}>
                    <Tooltip title="Click me to add book">
                      <NoteAdd className={classes.righticon} onClick={()=>changeDrawerStatus()}/>
                    </Tooltip>
                  </div>
                  
  
                </Grid>
              </Grid>
              {/* <div
                className={classes.buttonInfo} >
                
              </div>
              <div className={classes.buttonInfo} >
                
              </div> */}
            </div>
          )}
        </PersonalLibraryContext.Consumer>
      </PersonalLibraryProvider>
    </div>
  )
}
export default withStyles(styles)(BookApp)
