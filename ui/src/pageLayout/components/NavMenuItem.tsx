// Libraries
import React, {Component} from 'react'
import {Link} from 'react-router'
import classnames from 'classnames'
import _ from 'lodash'

// Components
import NavMenuSubItem from 'src/pageLayout/components/NavMenuSubItem'
import {Select} from 'src/clockface'

// Types
import {IconFont} from 'src/clockface'

interface Props {
  icon: IconFont
  title: string
  link: string
  children?: JSX.Element | JSX.Element[]
  location: string
  highlightWhen: string[]
}

class NavMenuItem extends Component<Props> {
  public render() {
    const {icon, title, link} = this.props

    return (
      <div className={classnames('nav--item', {active: this.isActive})}>
        <Link className="nav--item-icon" to={link}>
          <span className={`icon sidebar--icon ${icon}`} />
        </Link>
        <div className="nav--item-menu">
          <Link className="nav--item-header" to={link}>
            {title}
          </Link>
          {this.children}
        </div>
      </div>
    )
  }

  private get isActive(): boolean {
    const {location, highlightWhen} = this.props
    const {length} = _.intersection(_.split(location, '/'), highlightWhen)

    return !!length
  }

  private get children(): JSX.Element | JSX.Element[] {
    const {children} = this.props

    if (React.Children.count(children)) {
      return <Select type={NavMenuSubItem}>{children}</Select>
    }
  }
}

export default NavMenuItem
