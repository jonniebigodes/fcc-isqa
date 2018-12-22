import React from 'react'
import PropTypes from 'prop-types'
import Typography from '@material-ui/core/Typography'
import {withStyles} from '@material-ui/core/styles'
import classNames from 'classnames'
import Grid from '@material-ui/core/Grid'
import Card from '@material-ui/core/Card'
import CardActions from '@material-ui/core/CardActions'
import CardContent from '@material-ui/core/CardContent'
import CardMedia from '@material-ui/core/CardMedia'
import Button from '@material-ui/core/Button'

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
      width: 1100,
      marginLeft: 'auto',
      marginRight: 'auto'
    }
  },
  layoutEmpty: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    /* justify: 'space-between' */
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
  cardContent: {
    flexGrow: 1
  },
  cardMedia: {
    // paddingTop: '56.25%' // 16:9
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
  gridInfo: {
    paddingTop: theme.spacing.unit * 3,
    paddingBottom: theme.spacing.unit * 2
  }
})

const Issues = props => {
  const {projectIssues, closeIssue, delIssue, issueEdit, classes} = props
  if (!projectIssues) {
    return (
      <div className={classes.layout}>
        <Typography component="h2" variant="display2" gutterBottom>
          Nothing yet...
        </Typography>
      </div>
    )
  }
  const {issues} = projectIssues
  if (issues.length === 0) {
    return (
      <div className={classes.layoutEmpty}>
        <Typography component="h2" variant="display2" gutterBottom>
          No issues created yet
        </Typography>
      </div>
    )
  }

  const openIssues = issues.filter(x => x.open === true)
  const closedIssues = issues.filter(x => x.open === false)
  /* eslint-disable */

  return (
    <div className={classNames(classes.layout, classes.cardGrid)}>
      <Grid container spacing={40}>
        <Grid item xs={12} xs={12} sm={6} md={6}>
          <div className={classes.gridInfo}>
            <Typography
              component="h2"
              variant="headline"
              gutterBottom
              align="center">
              Open Issues
            </Typography>
          </div>
          {openIssues.map(item => (
            <Grid item key={`openissue_${item._id}`}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_164edaf95ee%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_164edaf95ee%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.32500076293945%22%20y%3D%22118.8%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" // eslint-disable-line max-len
                  title="Image title"
                />
                <CardContent className={classes.cardContent}>
                  <Typography
                    gutterBottom
                    variant="headline"
                    component="h5"
                    noWrap>
                    {item.issuetitle}
                  </Typography>
                  <Typography gutterBottom>{item.text}</Typography>
                  <Typography>Created in {item.issuecreated}</Typography>
                  <Typography>Updated in: {item.issueupdated}</Typography>
                  <Typography paragraph gutterBottom>
                    Created by: {item.creator} and currently assigned to{' '}
                    {item.assigned} with status {item.status}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => issueEdit(item._id)}>
                    Edit Issue
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => closeIssue(item._id)}>
                    Close Issue
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => delIssue(item._id)}>
                    Delete Issue
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Grid item xs={12} sm={6} md={4} lg={3}>
          <div className={classes.gridInfo}>
            <Typography
              component="h2"
              variant="headline"
              gutterBottom
              align="center">
              Closed Issues
            </Typography>
          </div>
          {closedIssues.map(item => (
            <Grid item key={`closedissue_${item._id}`}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.cardMedia}
                  image="data:image/svg+xml;charset=UTF-8,%3Csvg%20width%3D%22288%22%20height%3D%22225%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20288%20225%22%20preserveAspectRatio%3D%22none%22%3E%3Cdefs%3E%3Cstyle%20type%3D%22text%2Fcss%22%3E%23holder_164edaf95ee%20text%20%7B%20fill%3A%23eceeef%3Bfont-weight%3Abold%3Bfont-family%3AArial%2C%20Helvetica%2C%20Open%20Sans%2C%20sans-serif%2C%20monospace%3Bfont-size%3A14pt%20%7D%20%3C%2Fstyle%3E%3C%2Fdefs%3E%3Cg%20id%3D%22holder_164edaf95ee%22%3E%3Crect%20width%3D%22288%22%20height%3D%22225%22%20fill%3D%22%2355595c%22%3E%3C%2Frect%3E%3Cg%3E%3Ctext%20x%3D%2296.32500076293945%22%20y%3D%22118.8%22%3EThumbnail%3C%2Ftext%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E" // eslint-disable-line max-len
                  title="Image title"
                />
                <CardContent className={classes.cardContent}>
                  <Typography
                    gutterBottom
                    variant="headline"
                    component="h5"
                    noWrap>
                    {item.issuetitle}
                  </Typography>
                  <Typography gutterBottom>{item.text}</Typography>
                  <Typography>Created in {item.issuecreated}</Typography>
                  <Typography>Updated in: {item.issueupdated}</Typography>
                  <Typography paragraph gutterBottom>
                    Created by: {item.creator} and currently assigned to{' '}
                    {item.assigned} with status {item.status}
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Edit Issue
                  </Button>
                  <Button
                    size="small"
                    color="primary"
                    onClick={() => delIssue(item._id)}>
                    Delete Issue
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Grid>
    </div>
    /* eslint-enable */
  )
}
Issues.propTypes = {
  projectIssues: PropTypes.shape({
    id: PropTypes.string,
    title: PropTypes.string,
    creationdate: PropTypes.string,
    issues: PropTypes.arrayOf(
      PropTypes.shape({
        issuecreated: PropTypes.string,
        issueupdated: PropTypes.string,
        open: PropTypes.bool,
        _id: PropTypes.string,
        project: PropTypes.string,
        issuetitle: PropTypes.string,
        text: PropTypes.string,
        creator: PropTypes.string,
        assigned: PropTypes.string,
        status: PropTypes.string
      })
    )
  }),
  delIssue: PropTypes.func,
  closeIssue: PropTypes.func,
  issueEdit: PropTypes.func,
  classes: PropTypes.shape({}) //eslint-disable-line
}

export default withStyles(styles)(Issues)
