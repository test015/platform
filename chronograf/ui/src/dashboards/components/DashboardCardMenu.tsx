// Libraries
import React, {PureComponent} from 'react'
import classnames from 'classnames'

// Components
import {Button, ButtonShape, ComponentSize, IconFont} from 'src/clockface'
import MenuTooltipButton, {
  MenuItem,
} from 'src/shared/components/MenuTooltipButton'

// Types
import {Dashboard} from 'src/types/v2'

interface Props {
  dashboard: Dashboard
  onDelete: () => void
  onClone: () => void
  onExport: () => void
  // onEdit: () => void
}

interface State {
  subMenuIsOpen: boolean
}

class DashboardCardMenu extends PureComponent<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = {
      subMenuIsOpen: true,
    }
  }

  public render() {
    return <div className={this.contextMenuClassname}>{this.renderMenu}</div>
  }

  private get renderMenu(): JSX.Element {
    return (
      <div className="dash-graph-context--buttons">
        <Button
          icon={IconFont.Pencil}
          shape={ButtonShape.Square}
          size={ComponentSize.ExtraSmall}
          customClass="dashboard-card-menu--button"
          onClick={this.handleEdit}
        />
        <Button
          icon={IconFont.Export}
          shape={ButtonShape.Square}
          size={ComponentSize.ExtraSmall}
          customClass="dashboard-card-menu--button"
          onClick={this.handleExport}
        />
        <MenuTooltipButton
          icon="duplicate"
          menuItems={this.cloneMenuItems}
          informParent={this.handleToggleSubMenu}
        />
        <MenuTooltipButton
          icon="trash"
          theme="danger"
          menuItems={this.deleteMenuItems}
          informParent={this.handleToggleSubMenu}
        />
      </div>
    )
  }

  private get cloneMenuItems(): MenuItem[] {
    return [
      {
        text: 'Clone Dashboard',
        action: this.handleCloneDashboard,
        disabled: false,
      },
    ]
  }

  private get deleteMenuItems(): MenuItem[] {
    return [
      {text: 'Confirm', action: this.handleDeleteDashboard, disabled: false},
    ]
  }

  private handleEdit = (): void => {
    // const {onEdit} = this.props
    // onEdit()
  }

  private handleExport = (): void => {
    const {onExport} = this.props
    onExport()
  }

  private handleDeleteDashboard = (): void => {
    const {onDelete} = this.props
    onDelete()
  }

  private handleCloneDashboard = (): void => {
    const {onClone} = this.props
    onClone()
  }

  private handleToggleSubMenu = (): void => {
    this.setState({subMenuIsOpen: !this.state.subMenuIsOpen})
  }

  private get contextMenuClassname(): string {
    const {subMenuIsOpen} = this.state

    return classnames('dash-graph-context', {
      'dash-graph-context__open': subMenuIsOpen,
    })
  }
}

export default DashboardCardMenu
