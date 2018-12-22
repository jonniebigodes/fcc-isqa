import React from 'react'
import PropTypes from 'prop-types'
import {withRouter} from 'react-router-dom'
import classNames from 'classnames'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Typography from '@material-ui/core/Typography'
import Button from '@material-ui/core/Button'
import {withStyles} from '@material-ui/core/styles'

const styles = theme => ({
  layout: {
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.down('xs')]: {
      width: '400px',
      display: 'block',
      marginLeft: 'auto',
      marginRight: 'auto'
    },
    [theme.breakpoints.up(1100 + theme.spacing.unit * 3 * 2)]: {
      width: 800,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    [theme.breakpoints.down('xs')]: {
      width: 250
    },
    [theme.breakpoints.between('sm', 'md')]: {
      width: 300
    },
    [theme.breakpoints.up('md')]: {
      width: 400
    }
  },
  cardMedia: {
    paddingTop: '30.25%', // 16:9
    [theme.breakpoints.down('xs')]: {
      paddingTop: '10.25%', // 16:9
      width: 300
    },
    [theme.breakpoints.between('sm', 'md')]: {
      paddingTop: '22.25%', // 16:9
      width: 300
    },
    [theme.breakpoints.up('md')]: {
      paddingTop: '26.25%', // 16:9
      width: 400
    }
  },
  cardContent: {
    flexGrow: 1
  },
  heroContent: {
    maxWidth: 600,
    margin: '0 auto',
    padding: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 6}px`
  },
  cardGrid: {
    padding: `${theme.spacing.unit * 8}px 0`
  }
})

const Projects = props => {
  const {projectsData, classes, deleteProject, history} = props

  return (
    <div className={classNames(classes.layout, classes.cardGrid)}>
      <Grid container spacing={40} wrap="wrap">
        {projectsData.map(item => (
          <Grid item key={item.id} xs={12} sm={6} md={6}>
            <Card
              className={classes.card}
              key={`project_${item.id}`}
              id={`project_${item.id}`}>
              <CardMedia
                className={classes.cardMedia}
                image="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_164edaf95ee%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_164edaf95ee%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.32500076293945%22%20y%3D%22118.8%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" // eslint-disable-line max-len
                title="Image title"
              />
              <CardContent className={classes.cardContent}>
                <Typography gutterBottom variant="headline" component="h2">
                  {item.title}
                </Typography>
                <Typography>Number of issues: {item.issues}</Typography>
                <Typography>Created in {item.creationdate}</Typography>
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => history.push(`/issuetracker/${item.id}`)}>
                  View Issues
                </Button>
                <Button
                  size="small"
                  color="primary"
                  onClick={() => deleteProject(item.id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </div>
  )
}
Projects.propTypes = {
  history: PropTypes.shape({}),
  classes: PropTypes.shape({}),
  projectsData: PropTypes.arrayOf(PropTypes.shape({})),
  deleteProject: PropTypes.func
}
export default withRouter(withStyles(styles)(Projects))
